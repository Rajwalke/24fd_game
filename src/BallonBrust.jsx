import React, { useState, useEffect, useCallback, useRef } from 'react';
// Import all balloon images
import balloon1 from './Graphics/alchol.png';
import balloon2 from './Graphics/cigarate.png';
import balloon3 from './Graphics/fastfood.png';
import balloon4 from './Graphics/germ11.png';
import balloon5 from './Graphics/germ12.png';

import BowArrowImg from "./Graphics/BowArrowImg.png";
import ArrowImg from './Graphics/Arrow.png';
import backgroundImg from "./Graphics/Symbol 3 copy.jpg";
import BombImg from "./Graphics//medicine.png";
import GameIsOver from './GameIsOver';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUserScore } from './utils/userDataSlice';
import { addAlluser } from './utils/userSlice';
import PopupContainer from './PopupContainer';
import Userboard from './Userboard';
import Trajectory from './Trajectory';
import Instructions from './Instruction';
import BowandArrow from './Bow&Arrow';
import BlastEffect from './BlastEffect';

const BalloonBurstGame = () => {
  // Game state
  const [isBombBlast, setIsBombBlast] = useState(false);
  const [score, setScore] = useState(0);
  const [tierStatusText, setTierStatusText] = useState('🌱 Beginner Blower');
  const [balloons, setBalloons] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  const dispatch = useDispatch();
  const fullName = useSelector((store) => store?.userData?.userName);
  const email=useSelector((store)=>store?.userData?.email);
  const id = useSelector((store) => store?.userData?.id);
  
  // Mouse position state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Bow and Arrow state
  const[popup,setPopup]=useState(false);
  const [bowRotation, setBowRotation] = useState(-45); // Default upward direction
  const [arrows, setArrows] = useState([]);
  const [canShoot, setCanShoot] = useState(true);
  const [isSpawningBalloons, setIsSpawningBalloons] = useState(true);
  const [trajectoryPoints, setTrajectoryPoints] = useState([]);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const gameAreaRef = useRef(null);
  const bowRef = useRef(null);
  const [blastEffects, setBlastEffects] = useState([]);
  const timeoutRefs = useRef({ single: null, burst: null });
  // Track which balloons have been hit to prevent duplicate collisions
  const hitBalloonsRef = useRef(new Set());

  // Game configuration
  const tiers = [
    "🌱 Beginner Blower",
    "🚀 Balloon Master", 
    "✨ Air Wizard", 
    "☁️ Sky Champion", 
    "🔥 Balloon God"
  ];

  const balloonImages = [
    balloon1, 
    balloon2, 
    balloon3, 
    balloon4, 
    balloon5, 
  ];

  // Format time function (convert seconds to MM:SS format)
  // const formatTime = (seconds) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  // };

  // Custom CSS for fly animation with increased speed
  const flyAnimation = `
    @keyframes fly {
      0% { transform: translateX(var(--start-x)) translateY(0); }
      100% { transform: translateX(var(--end-x)) translateY(-100vh); }
    }
    .animate-fly {
      animation: fly 3s linear forwards;
    }
    
    @keyframes arrow-move {
      0% { transform: translate(0, 0) rotate(var(--arrow-rotation)); }
      100% { transform: translate(var(--arrow-dx), var(--arrow-dy)) rotate(var(--arrow-rotation)); }
    }
    .animate-arrow {
      animation: arrow-move 1.5s linear forwards;
      will-change: transform;
    }
    
    @keyframes blast {
      0% { transform: scale(0.1); opacity: 0; }
      25% { opacity: 1; }
      100% { transform: scale(6); opacity: 0; }
    }
    .animate-blast {
      animation: blast 0.7s ease-out forwards;
      will-change: transform, opacity;
    }
  `;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine balloon size based on screen size
  const getBalloonSize = () => {
    if (windowSize.width < 640) return 75; // Mobile
    if (windowSize.width < 1024) return 90; // Tablet
    return 95; // Desktop and larger
  };

  // Determine bow size based on screen size
  // const getBowSize = () => {
  //   if (windowSize.width < 640) return 'w-24'; // Mobile
  //   if (windowSize.width < 1024) return 'w-32'; // Tablet
  //   return 'w-24'; // Desktop and larger
  // };

  // Create a new balloon
  const createBalloon = useCallback(() => {
    // Determine if this balloon should be a bomb (10% chance)
    const isBomb = Math.random() < 0.1;
    const randomImage = isBomb ? BombImg : balloonImages[Math.floor(Math.random() * balloonImages.length)];

    const startX = Math.random() * 90;
    const endX = Math.random() * 180 - 40;
    
    return {
      id: Date.now() + Math.random(), // Ensure unique IDs even when creating multiple balloons at once
      src: randomImage,
      size: getBalloonSize(), // Dynamic size based on screen size
      clicks: 0,
      isFlying: false,
      startX: `${startX}%`, // Random horizontal start position
      endX: `${endX}%`, // Random horizontal end position
      isBomb: isBomb,
      // Add hitbox data for more accurate collision detection
      hitbox: {
        width: getBalloonSize(),
        height: getBalloonSize()
      }
    };
  }, [balloonImages, getBalloonSize]);

  const navigate = useNavigate();
  
  // End game function
  const endGame = useCallback(() => {
    setIsSpawningBalloons(false);
    dispatch(addUserScore(score));
    setGameOver(true);
    
    // Clear all timeouts
    if (timeoutRefs.current.single) clearTimeout(timeoutRefs.current.single);
    if (timeoutRefs.current.burst) clearTimeout(timeoutRefs.current.burst);
    
    setTimeout(() => {
      dispatch(addAlluser({
        "fullName": fullName,
        "Score": score,
        "email":email
      }));
      navigate("/");
    }, 4000);
  }, [dispatch, fullName, email, id, navigate, score]);

  // Create blast effect function
  const createBlastEffect = (x, y) => {
    const newBlast = {
      id: Date.now(),
      x: x,
      y: y,
      active: true
    };
    
    setBlastEffects(prev => [...prev, newBlast]);
    
    // Remove blast effect after animation completes
    setTimeout(() => {
      setBlastEffects(prev => prev.filter(blast => blast.id !== newBlast.id));
    }, 700); // Matches animation duration
  };

  // Game timer effect
  useEffect(() => {
    if (gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameOver, endGame]);

  // Calculate trajectory points exactly matching the arrow's path
  const calculateTrajectoryPoints = useCallback((bowCenterX, bowCenterY, angle, maxDistance = 500) => {
    const points = [];
    const numPoints = 10; // Number of dots in trajectory line
    const angleRad = angle * (Math.PI / 180);
    const dx = Math.cos(angleRad);
    const dy = Math.sin(angleRad);
    
    // Get the game area position for relative coordinates
    const gameAreaRect = gameAreaRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    
    // Calculate the exact starting point of the arrow relative to game area
    const arrowStartX = bowCenterX - gameAreaRect.left;
    const arrowStartY = bowCenterY - gameAreaRect.top;
    
    for (let i = 0; i < numPoints; i++) {
      const distance = (i + 1) * (maxDistance / numPoints);
      points.push({
        x: arrowStartX + dx * distance,
        y: arrowStartY + dy * distance
      });
    }
    
    return points;
  }, []);

  // Handle mouse/touch movement to aim the bow - IMPROVED to work anywhere on screen
  useEffect(() => {
    if (gameOver || !bowRef.current || !gameAreaRef.current) return;
    
    const handleMove = (e) => {
      // Get client coordinates for both mouse and touch events
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
      
      if (clientX === null || clientY === null) return;
      
      // Update mouse position state
      setMousePosition({ x: clientX, y: clientY });
      
      // Calculate bow position
      const bowRect = bowRef.current.getBoundingClientRect();
      const bowCenterX = bowRect.left + bowRect.width / 2;
      const bowCenterY = bowRect.top + bowRect.height / 2;
      
      // Calculate angle between mouse and bow center
      const angle = Math.atan2(
        clientY - bowCenterY,
        clientX - bowCenterX
      ) * (180 / Math.PI);
      
      // Constrain rotation to upper half only (-180 to 0 degrees)
      let constrainedAngle = angle;
      if (constrainedAngle > 0) {
        constrainedAngle = -180 + constrainedAngle;
      }
      
      // Further constrain to reasonable angles
      constrainedAngle = Math.max(constrainedAngle, -180);
      constrainedAngle = Math.min(constrainedAngle, 0);
      
      setBowRotation(constrainedAngle);
      
      // Calculate trajectory points from bow position
      const newTrajectoryPoints = calculateTrajectoryPoints(
        bowCenterX, 
        bowCenterY, 
        constrainedAngle
      );
      
      setTrajectoryPoints(newTrajectoryPoints);
    };
    
    // Always track mouse movement across the entire window
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [gameOver, calculateTrajectoryPoints]);

  // Shoot arrow function - now can be triggered by clicking anywhere on screen
  const shootArrow = useCallback(() => {
    if (!canShoot || gameOver || !trajectoryPoints.length || !bowRef.current || !gameAreaRef.current) return;
    
    // Get bow position
    const bowRect = bowRef.current.getBoundingClientRect();
    const bowCenterX = bowRect.left + bowRect.width / 4;
    const bowCenterY = bowRect.top + bowRect.height / 4;
    
    // Get game area for relative positioning
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    
    // Calculate the exact start position of the arrow relative to game area
    const arrowStartX = bowCenterX - gameAreaRect.left;
    const arrowStartY = bowCenterY - gameAreaRect.top;
    
    // Calculate arrow path based on bow rotation
    const angleRad = bowRotation * (Math.PI / 180);
    
    // Set a fixed distance for arrow travel - large enough to cross entire screen on any display size
    // Calculate based on screen dimensions to ensure arrows travel fully across the screen
    const arrowDistance = Math.max(windowSize.width * 2, windowSize.height * 2);
    const dx = Math.cos(angleRad) * arrowDistance;
    const dy = Math.sin(angleRad) * arrowDistance;
    
    // Create new arrow with coordinates
    const newArrow = {
      id: Date.now(),
      x: arrowStartX,
      y: arrowStartY,
      rotation: bowRotation,
      dx: dx,
      dy: dy,
      active: true,
      // Add hitbox data for more accurate collision detection
      hitbox: {
        width: 10, // Arrow tip width for collision
        height: 10  // Arrow tip height for collision
      }
    };
    
    setArrows(prev => [...prev, newArrow]);
    
    // Cooldown for shooting
    setCanShoot(false);
    setTimeout(() => setCanShoot(true), 500);
  }, [bowRotation, canShoot, gameOver, trajectoryPoints.length, windowSize]);

  // Handle click anywhere on screen to shoot
  useEffect(() => {
    if (gameOver) return;
    
    const handleClick = () => {
      shootArrow();
    };
    
    // Add click event to game area
    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener('click', handleClick);
      gameArea.addEventListener('touchend', handleClick);
    }
    
    return () => {
      if (gameArea) {
        gameArea.removeEventListener('click', handleClick);
        gameArea.removeEventListener('touchend', handleClick);
      }
    };
  }, [gameOver, shootArrow]);

  // IMPROVED collision detection between arrows and balloons
  useEffect(() => {
    if (gameOver) return;
    
    const checkCollisions = () => {
      if (arrows.length === 0 || balloons.length === 0) return;
      
      // Get game area for relative positioning
      const gameAreaRect = gameAreaRef.current?.getBoundingClientRect();
      if (!gameAreaRect) return;
      
      // Create a copy of the current state
      const currentArrows = [...arrows];
      const currentBalloons = [...balloons];
      let scoreIncrease = 0;
      let hitBomb = false;
      let bombPosition = null;
      
      // Process hit detection
      const balloonsToRemove = new Set();
      const arrowsToRemove = new Set();
      
      // Check each arrow
      for (const arrow of currentArrows) {
        if (!arrow.active) continue;
        
        const arrowElement = document.getElementById(`arrow-${arrow.id}`);
        if (!arrowElement) continue;
        
        const arrowRect = arrowElement.getBoundingClientRect();
        
        // Create a more precise collision box for the arrow tip
        const arrowTipSize = 20; // Larger tip size for better hit detection
        const arrowTipOffsetX = Math.cos(arrow.rotation * (Math.PI / 180)) * 20;
        const arrowTipOffsetY = Math.sin(arrow.rotation * (Math.PI / 180)) * 20;
        
        // Get the tip position based on arrow's rotation
        const arrowTip = {
          left: arrowRect.left + arrowRect.width / 2 + arrowTipOffsetX - arrowTipSize / 2,
          top: arrowRect.top + arrowRect.height / 2 + arrowTipOffsetY - arrowTipSize / 2,
          right: arrowRect.left + arrowRect.width / 2 + arrowTipOffsetX + arrowTipSize / 2,
          bottom: arrowRect.top + arrowRect.height / 2 + arrowTipOffsetY + arrowTipSize / 2,
          width: arrowTipSize,
          height: arrowTipSize,
          centerX: arrowRect.left + arrowRect.width / 2 + arrowTipOffsetX,
          centerY: arrowRect.top + arrowRect.height / 2 + arrowTipOffsetY
        };
        
        // Check against each balloon
        for (const balloon of currentBalloons) {
          // Skip if this balloon has already been hit
          if (hitBalloonsRef.current.has(balloon.id) || balloonsToRemove.has(balloon.id)) continue;
          
          const balloonElement = document.querySelector(`[data-id="${balloon.id}"]`);
          if (!balloonElement) continue;
          
          const balloonRect = balloonElement.getBoundingClientRect();
          
          // Calculate the center of the balloon for distance-based collision
          const balloonCenterX = balloonRect.left + balloonRect.width / 2;
          const balloonCenterY = balloonRect.top + balloonRect.height / 2;
          
          // Calculate distance between centers for circle-based collision
          const dx = arrowTip.centerX - balloonCenterX;
          const dy = arrowTip.centerY - balloonCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Set collision radius based on balloon size (75% of its width for better accuracy)
          const collisionRadius = balloonRect.width * 0.6;
          
          // Check if arrow tip is within balloon radius
          const collision = distance < collisionRadius;
          
          if (collision) {
            // Mark this arrow as hit
            arrowsToRemove.add(arrow.id);
            
            // Mark this balloon as hit
            balloonsToRemove.add(balloon.id);
            hitBalloonsRef.current.add(balloon.id);
            
            // Handle bomb or regular balloon
            if (balloon.isBomb) {
              hitBomb = true;
              bombPosition = {
                x: balloonCenterX - gameAreaRect.left,
                y: balloonCenterY - gameAreaRect.top
              };
            } else {
              // Regular balloon hit
              scoreIncrease += 10;
              
              // Create a blast effect for regular balloons
              createBlastEffect(
                balloonCenterX - gameAreaRect.left,
                balloonCenterY - gameAreaRect.top
              );
            }
            
            // Only one hit per arrow
            break;
          }
        }
      }
      
      // Update states if there were any hits
      if (balloonsToRemove.size > 0 || arrowsToRemove.size > 0) {
        // Update arrows
        setArrows(currentArrows.filter(arrow => !arrowsToRemove.has(arrow.id)));
        
        // Update balloons
        setBalloons(currentBalloons.filter(balloon => !balloonsToRemove.has(balloon.id)));
        
        // Update score
        if (scoreIncrease > 0) {
          setScore(prev => {
            const newScore = prev + scoreIncrease;
            
            // Update tier status based on new score
            let newTierStatus = '';
            if (newScore >= 0 && newScore <= 49) newTierStatus = tiers[0];
            else if (newScore >= 50 && newScore <= 99) newTierStatus = tiers[1];
            else if (newScore >= 100 && newScore <= 149) newTierStatus = tiers[2];
            else if (newScore >= 150 && newScore <= 299) newTierStatus = tiers[3];
            else if (newScore >= 300) newTierStatus = tiers[4];
            
            setTierStatusText(newTierStatus);
            
            return newScore;
          });
        }
        
        // Handle bomb hit
        if (hitBomb && bombPosition) {
          // Create large blast effect
          createBlastEffect(bombPosition.x, bombPosition.y);
          setIsBombBlast(true);
          // End game with slight delay
          // setTimeout(() => endGame(), 500);
          setTimeLeft(timeLeft+5);
          setPopup(true);
          setTimeout(() => {
            setPopup(false);
          }, 2000);
        }
      }
    };
    
    // Run collision detection more frequently for better responsiveness
    const collisionInterval = setInterval(checkCollisions, 16); // ~60fps for smoother hit detection
    return () => clearInterval(collisionInterval);
  }, [arrows, balloons, gameOver, tiers, endGame]);

  // Improved balloon spawning system
  useEffect(() => {
    if (gameOver || !isSpawningBalloons) return;
    
    // Initial spawn to ensure there are balloons right away
    if (balloons.length === 0) {
      const initialBalloons = Array(6).fill().map(() => {
        const newBalloon = createBalloon();
        newBalloon.isFlying = true;
        return newBalloon;
      });
      setBalloons(initialBalloons);
    }
    
    // Create a continuous spawning system with randomized timing
    const spawnSingleBalloon = () => {
      if (gameOver || !isSpawningBalloons) return;
      
      setBalloons(prev => {
        const newBalloon = createBalloon();
        newBalloon.isFlying = true;
        
        // Keep a reasonable number of balloons for performance
        const combined = [...prev, newBalloon];
        if (combined.length > 20) {
          return [newBalloon, ...prev.slice(0, 19)];
        }
        return combined;
      });
      
      // Schedule next balloon with random timing
      const randomDelay = Math.floor(Math.random() * 500) + 100; // Random delay between 100-400ms
      timeoutRefs.current.single = setTimeout(spawnSingleBalloon, randomDelay);
    };
    
    // Create sporadic bursts of multiple balloons
    const createBurst = () => {
      if (gameOver || !isSpawningBalloons) return;
      
      // Create a burst of 4-8 balloons all at once
      setBalloons(prev => {
        const burstCount = Math.floor(Math.random() * 3) + 2; // 4-8 balloons
        const burstBalloons = Array(burstCount).fill().map(() => {
          const newBalloon = createBalloon();
          newBalloon.isFlying = true;
          // Vary the starting positions more for burst balloons
          newBalloon.startX = `${Math.random() * 100}%`;
          return newBalloon;
        });
        
        const combined = [...prev, ...burstBalloons];
        if (combined.length > 50) {
          return [...burstBalloons, ...prev.slice(0, 50 - burstBalloons.length)];
        }
        return combined;
      });
      
      // Schedule next burst with random timing
      const randomBurstDelay = Math.floor(Math.random() * 2000) + 3000; // Random delay between 1-2.5 seconds
      timeoutRefs.current.burst = setTimeout(createBurst, randomBurstDelay);
    };
    
    // Start the continuous random spawning processes
    const initialDelay = Math.floor(Math.random() * 200) + 100;
    timeoutRefs.current.single = setTimeout(spawnSingleBalloon, initialDelay);
    timeoutRefs.current.burst = setTimeout(createBurst, 800);
    
    // Cleanup function
    return () => {
      if (timeoutRefs.current.single) clearTimeout(timeoutRefs.current.single);
      if (timeoutRefs.current.burst) clearTimeout(timeoutRefs.current.burst);
    };
  }, [balloons.length, createBalloon, gameOver, isSpawningBalloons]);

  // Auto-remove flying balloons that have gone off screen
  useEffect(() => {
    const timer = setInterval(() => {
      setBalloons(prev => {
        return prev.filter(balloon => {
          const element = document.querySelector(`[data-id="${balloon.id}"]`);
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return rect.bottom > 0; // Keep if still on screen
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Cleanup old arrows that go outside the screen boundaries
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setArrows(prev => {
        // Remove arrows that have gone off screen
        return prev.filter(arrow => {
          const element = document.getElementById(`arrow-${arrow.id}`);
          if (!element) return false;
          
          const rect = element.getBoundingClientRect();
          // Use much larger boundaries to ensure arrows don't get cleaned up too early
          return rect.top > -1000 && rect.bottom < window.innerHeight + 1000 &&
                 rect.left > -1000 && rect.right < window.innerWidth + 1000;
        });
      });
    }, 1000);
    
    return () => clearInterval(cleanupInterval);
  }, []);

  // Reset hit balloons tracker when game resets
  useEffect(() => {
    if (!gameOver) {
      hitBalloonsRef.current = new Set();
    }
  }, [gameOver]);

  // Get appropriate arrow size based on screen size
  const getArrowSize = () => {
    if (windowSize.width < 640) return { width: '40px', height: '20px' }; // Mobile
    if (windowSize.width < 1024) return { width: '60px', height: '30px' }; // Tablet
    return { width: '80px', height: '40px' }; // Desktop
  };

  // Get appropriate trajectory dot size based on screen size
  // const getTrajectoryDotSize = (index) => {
  //   const baseSize = windowSize.width < 640 ? 4 : windowSize.width < 1024 ? 6 : 8;
  //   return index % 2 === 0 ? `${baseSize}px` : `${baseSize - 2}px`;
  // };

  // Get appropriate font sizes for UI elements based on screen size
  // const getFontSize = (type) => {
  //   if (type === 'header') {
  //     return windowSize.width < 640 ? 'text-lg' : windowSize.width < 1024 ? 'text-xl' : 'text-2xl';
  //   } else if (type === 'instruction') {
  //     return windowSize.width < 640 ? 'text-base' : windowSize.width < 1024 ? 'text-lg' : 'text-2xl';
  //   }
  //   return 'text-base';
  // };

  // Get blast effect size based on screen size
  const getBlastSize = () => {
    if (windowSize.width < 640) return { size: '80px' }; // Mobile
    if (windowSize.width < 1024) return { size: '100px' }; // Tablet
    return { size: '120px' }; // Desktop
  };

  return (
    <>
      {/* Add custom animation styles */}
      <style>{flyAnimation}</style>
      
      <div 
        ref={gameAreaRef}
        style={{ backgroundImage: `url(${backgroundImg})` }} 
        className="bg-cover bg-center fixed inset-0 overflow-hidden cursor-crosshair"
      >
      {popup && 
          <PopupContainer/>
      }
      {/* Score, Tier and Timer Display */}
      {/* { here is userDahsboard} */}
      <Userboard fullName={fullName} 
      tierStatusText={tierStatusText} 
      timeLeft={timeLeft}
      score={score}

      />

        {/* Balloon Container */}
        <div className="relative w-full h-full">
          {balloons.map(balloon => (
            <img 
              key={balloon.id}
              src={balloon.src}
              alt={balloon.isBomb ? "Bomb" : "Balloon"}
              className={`absolute bottom-0 balloon-element ${balloon.isFlying ? 'animate-fly' : ''}`}
              data-id={balloon.id}
              style={{
                width: `${balloon.size}px`,
                height: `${balloon.size}px`,
                left: balloon.startX,
                '--start-x': balloon.startX,
                '--end-x': balloon.endX,
                zIndex: 10
              }}
            />
          ))}
          
          {/* Blast Effects */}
          {blastEffects.map(blast => {
            const blastSize = getBlastSize();
            return (
             <BlastEffect blastSize={blastSize} 
              blast={blast}
             />
            );
          })}
          
          {/* Trajectory Line */}
          {canShoot && trajectoryPoints.map((point, index) => (
            <Trajectory index={index} point={point} windowSize={windowSize}/>
          ))}
          
          {/* Flying Arrows */}
          {arrows.map(arrow => {
            const arrowSize = getArrowSize();
            return (
              <img 
              id={`arrow-${arrow.id}`}
              key={arrow.id}
              src={ArrowImg}
              alt="Arrow"
              className="absolute animate-arrow"
              style={{
                width: arrowSize.width,
                height: arrowSize.height,
                left: `${arrow.x}px`,
                top: `${arrow.y}px`,
                '--arrow-rotation': `${arrow.rotation}deg`,
                '--arrow-dx': `${arrow.dx}px`,
                '--arrow-dy': `${arrow.dy}px`,
                transform: `rotate(${arrow.rotation}deg)`,
                transformOrigin: 'center center',
                zIndex: 20
              }}
            />
            );
          })}
        </div>

        {/* Game Over Message */}
        {gameOver && <GameIsOver score={score} bomb={isBombBlast} />}

        {/* Instructions */}
        <Instructions BombImg={BombImg} windowSize={windowSize} />

        
        {/* Centered Bow and Arrow */}
      <BowandArrow 
      canShoot={canShoot} 
      bowRef={bowRef} 
      BowArrowImg={BowArrowImg} 
      bowRotation={bowRotation}
      windowSize={windowSize}
      gameOver={gameOver}
      trajectoryPoints={trajectoryPoints}
      gameAreaRef={gameAreaRef}
      setArrows={setArrows}
      setCanShoot={setCanShoot}
      shootArrow={shootArrow}
      />
      </div>
    </>
  );
};

export default BalloonBurstGame;