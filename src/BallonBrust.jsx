import React, { useState, useEffect, useCallback, useRef } from 'react';
// Import all balloon images
import balloon1 from './Graphics/Symbol 100001.png';
import balloon2 from './Graphics/Symbol 100002.png';
import balloon3 from './Graphics/Symbol 100003.png';
import balloon4 from './Graphics/Symbol 100004.png';
import balloon5 from './Graphics/Symbol 100005.png';

import BowArrowImg from "./Graphics/BowArrowImg.png";
import ArrowImg from './Graphics/Arrow.png';
import backgroundImg from "./Graphics/Symbol 3 copy.png";
import BombImg from "./Graphics/Bomb-Img.png";
import GameIsOver from './GameIsOver';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUserScore } from './utils/userDataSlice';
import { addAlluser } from './utils/userSlice';

const BalloonBurstGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [tierStatusText, setTierStatusText] = useState('🌱 Beginner Blower');
  const [balloons, setBalloons] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const dispatch = useDispatch();
  const fullName = useSelector((store) => store?.userData?.userName);
  const id = useSelector((store) => store?.userData?.id);
  
  // Bow and Arrow state
  const [bowRotation, setBowRotation] = useState(-45); // Default upward direction
  const [arrows, setArrows] = useState([]);
  const [canShoot, setCanShoot] = useState(true);
  const [isSpawningBalloons, setIsSpawningBalloons] = useState(true);
  const [trajectoryPoints, setTrajectoryPoints] = useState([]);
  const gameAreaRef = useRef(null);
  const bowRef = useRef(null);

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

  // Custom CSS for fly animation with moderate speed
  const flyAnimation = `
    @keyframes fly {
      0% { transform: translateX(var(--fly-start-x)) translateY(0); }
      100% { transform: translateX(var(--fly-end-x)) translateY(-100vh); }
    }
    .animate-fly {
      animation: fly 6s linear forwards;
    }
    
    @keyframes arrow-move {
      0% { transform: translate(0, 0) rotate(var(--arrow-rotation)); }
      100% { transform: translate(var(--arrow-dx), var(--arrow-dy)) rotate(var(--arrow-rotation)); }
    }
    .animate-arrow {
      animation: arrow-move 1.2s linear forwards;
    }
  `;

  // Create a new balloon
  const createBalloon = useCallback(() => {
    // Determine if this balloon should be a bomb (10% chance)
    const isBomb = Math.random() < 0.1;
    const randomImage = isBomb ? BombImg : balloonImages[Math.floor(Math.random() * balloonImages.length)];
    
    return {
      id: Date.now() + Math.random(), // Ensure unique IDs even when creating multiple balloons at once
      src: randomImage,
      size: 100, // Increased initial size
      clicks: 0,
      isFlying: false,
      startX: `${Math.random() * 90}%`, // Random horizontal start position
      endX: `${Math.random() * 180 - 40}%`, // Random horizontal end position
      isBomb: isBomb,
      element: null, // Will store reference to DOM element
    };
  }, [balloonImages]);

  const navigate = useNavigate();
  
  // End game function
  const endGame = () => {
    setIsSpawningBalloons(false);
    dispatch(addUserScore(score));
    setGameOver(true);
    
    setTimeout(() => {
      dispatch(addAlluser({
        "id": id,
        "fullName": fullName,
        "Score": score
      }));
      navigate("/");
    }, 4000);
  };

  // Calculate trajectory points exactly matching the arrow's path
  const calculateTrajectoryPoints = useCallback((bowCenterX, bowCenterY, angle, maxDistance = 500) => {
    const points = [];
    const numPoints = 10; // Number of dots in trajectory line
    const angleRad = angle * (Math.PI / 180);
    const dx = Math.cos(angleRad);
    const dy = Math.sin(angleRad);
    
    // Get the game area position for relative coordinates
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    
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

  // Handle mouse movement to aim the bow
  useEffect(() => {
    if (gameOver) return;
    
    const handleMove = (e) => {
      if (!bowRef.current || !gameAreaRef.current) return;
      
      const bowRect = bowRef.current.getBoundingClientRect();
      const bowCenterX = bowRect.left + bowRect.width / 2;
      const bowCenterY = bowRect.top + bowRect.height / 2;
      
      // Calculate angle between mouse and bow center
      const angle = Math.atan2(
        e.clientY - bowCenterY,
        e.clientX - bowCenterX
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
      
      // Calculate trajectory points starting from the exact bow position
      const newTrajectoryPoints = calculateTrajectoryPoints(
        bowCenterX, 
        bowCenterY, 
        constrainedAngle
      );
      
      setTrajectoryPoints(newTrajectoryPoints);
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [gameOver, calculateTrajectoryPoints]);

  // Shoot arrow function
  const shootArrow = () => {
    if (!canShoot || gameOver || !trajectoryPoints.length) return;
    
    // Get bow position
    const bowRect = bowRef.current.getBoundingClientRect();
    const bowCenterX = bowRect.left + bowRect.width / 2;
    const bowCenterY = bowRect.top + bowRect.height / 2;
    
    // Get game area for relative positioning
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    
    // Calculate the exact start position of the arrow
    const arrowStartX = bowCenterX - gameAreaRect.left;
    const arrowStartY = bowCenterY - gameAreaRect.top;
    
    // Calculate arrow path based on bow rotation
    const angleRad = bowRotation * (Math.PI / 180);
    const arrowSpeed = 1200;
    const dx = Math.cos(angleRad) * arrowSpeed;
    const dy = Math.sin(angleRad) * arrowSpeed;
    
    // Create new arrow with coordinates matching the trajectory
    const newArrow = {
      id: Date.now(),
      x: arrowStartX,
      y: arrowStartY,
      rotation: bowRotation,
      dx: dx,
      dy: dy,
      active: true
    };
    
    setArrows(prev => [...prev, newArrow]);
    
    // Cooldown for shooting
    setCanShoot(false);
    setTimeout(() => setCanShoot(true), 500);
  };

  // Check for arrow collisions with balloons
  useEffect(() => {
    if (gameOver || arrows.length === 0 || balloons.length === 0) return;
    
    const checkCollisions = () => {
      const activeArrows = [...arrows];
      const currentBalloons = [...balloons];
      let scoreIncrease = 0;
      let hitBomb = false;
      
      // Get all balloon elements
      const balloonElements = document.querySelectorAll('.balloon-element');
      
      activeArrows.forEach(arrow => {
        if (!arrow.active) return;
        
        const arrowElement = document.getElementById(`arrow-${arrow.id}`);
        if (!arrowElement) return;
        
        const arrowRect = arrowElement.getBoundingClientRect();
        
        // Check collision with each balloon
        balloonElements.forEach(balloonElement => {
          if (!arrow.active) return; // Skip if arrow already hit something
          
          const balloonId = balloonElement.dataset.id;
          const balloon = currentBalloons.find(b => b.id.toString() === balloonId);
          if (!balloon) return;
          
          const balloonRect = balloonElement.getBoundingClientRect();
          
          // Simple collision detection - check if rectangles overlap
          if (
            arrowRect.left < balloonRect.right &&
            arrowRect.right > balloonRect.left &&
            arrowRect.top < balloonRect.bottom &&
            arrowRect.bottom > balloonRect.top
          ) {
            // Arrow hit something
            arrow.active = false;
            
            // Check if it hit a bomb
            if (balloon.isBomb) {
              hitBomb = true;
            } else {
              // Remove balloon
              const index = currentBalloons.findIndex(b => b.id === balloon.id);
              if (index !== -1) {
                currentBalloons.splice(index, 1);
                scoreIncrease += 10;
              }
            }
          }
        });
      });
      
      // Update game state if collisions occurred
      if (hitBomb) {
        endGame();
        return;
      }
      
      if (scoreIncrease > 0) {
        setBalloons(currentBalloons);
        setScore(prev => prev + scoreIncrease);
        
        // Update tier status
        const newScore = score + scoreIncrease;
        let newTierStatus = '';
        if (newScore >= 0 && newScore <= 49) newTierStatus = tiers[0];
        else if (newScore >= 50 && newScore <= 99) newTierStatus = tiers[1];
        else if (newScore >= 100 && newScore <= 149) newTierStatus = tiers[2];
        else if (newScore >= 150 && newScore <= 299) newTierStatus = tiers[3];
        else if (newScore >= 300) newTierStatus = tiers[4];
        
        setTierStatusText(newTierStatus);
      }
      
      // Remove inactive arrows
      setArrows(activeArrows.filter(arrow => arrow.active));
    };
    
    const collisionInterval = setInterval(checkCollisions, 100);
    return () => clearInterval(collisionInterval);
  }, [arrows, balloons, gameOver, score, tiers]);

  // Spawn balloons continuously
  useEffect(() => {
    if (gameOver || !isSpawningBalloons) return;
    
    const spawnInterval = setInterval(() => {
      // Always spawn balloons to ensure continuous flow
      setBalloons(prev => {
        // Create 1-3 new balloons at once for more activity
        const numNewBalloons = Math.floor(Math.random() * 3) + 1;
        const newBalloons = [];
        
        for (let i = 0; i < numNewBalloons; i++) {
          const newBalloon = createBalloon();
          // Automatically set balloon to flying after creation
          newBalloon.isFlying = true;
          newBalloons.push(newBalloon);
        }
        
        // Keep a reasonable number for performance
        const combined = [...prev, ...newBalloons];
        if (combined.length > 30) {
          return [...newBalloons, ...prev.slice(0, 30 - newBalloons.length)];
        }
        return combined;
      });
    }, 500); // Faster spawn rate

    return () => clearInterval(spawnInterval);
  }, [balloons, createBalloon, gameOver, isSpawningBalloons]);

  // Auto-remove flying balloons that have gone off screen
  useEffect(() => {
    const timer = setInterval(() => {
      const updatedBalloons = balloons.filter(balloon => {
        const element = document.querySelector(`[data-id="${balloon.id}"]`);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0; // Keep if still on screen
      });
      
      if (updatedBalloons.length !== balloons.length) {
        setBalloons(updatedBalloons);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [balloons]);

  // Cleanup old arrows
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setArrows(prev => {
        // Remove arrows that have gone off screen
        return prev.filter(arrow => {
          const element = document.getElementById(`arrow-${arrow.id}`);
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return rect.top > 0 && rect.bottom < window.innerHeight &&
                 rect.left > 0 && rect.right < window.innerWidth;
        });
      });
    }, 1000);
    
    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <>
      {/* Add custom animation styles */}
      <style>{flyAnimation}</style>

      <div 
        ref={gameAreaRef}
        style={{ backgroundImage: `url(${backgroundImg})` }} 
        className="bg-cover bg-center fixed inset-0"
      >
        {/* Score and Tier Display */}
        <div className="absolute space-y-1 top-5 right-5 text-black z-10">
          <div className="text-2xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Welcome, {fullName}
          </div>
          <div className="text-2xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Score: {score}
          </div>
          <div className="text-2xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            {tierStatusText}
          </div>
        </div>

        {/* Balloon Container */}
        <div className="relative w-full h-full">
          {balloons.map(balloon => (
            <img 
              key={balloon.id}
              src={balloon.src}
              alt={balloon.isBomb ? "Bomb" : "Balloon"}
              className={`absolute bottom-0 balloon-element
                ${balloon.isFlying ? 'animate-fly' : ''}`}
              data-id={balloon.id}
              style={{
                width: `${balloon.size}px`,
                height: `${balloon.size}px`,
                left: balloon.startX,
                '--fly-start-x': balloon.startX,
                '--fly-end-x': balloon.endX,
                zIndex: 10
              }}
            />
          ))}
          
          {/* Trajectory Line */}
          {canShoot && trajectoryPoints.map((point, index) => (
            <div
              key={`trajectory-${index}`}
              className="absolute rounded-full bg-black z-50"
              style={{
                width: index % 2 === 0 ? '8px' : '6px',  // Alternating sizes for visual interest
                height: index % 2 === 0 ? '8px' : '6px',
                left: `${point.x}px`,
                top: `${point.y}px`,
                zIndex: 15
              }}
            />
          ))}
          
          {/* Flying Arrows */}
          {arrows.map(arrow => (
            <img 
              id={`arrow-${arrow.id}`}
              key={arrow.id}
              src={ArrowImg}
              alt="Arrow"
              className="absolute animate-arrow"
              style={{
                width: '80px',  // Increased arrow size
                height: '40px', // Increased arrow size
                left: `${arrow.x}px`,
                top: `${arrow.y}px`,
                '--arrow-rotation': `${arrow.rotation}deg`,
                '--arrow-dx': `${arrow.dx}px`,
                '--arrow-dy': `${arrow.dy}px`,
                transform: `rotate(${arrow.rotation}deg)`,
                zIndex: 20
              }}
            />
          ))}
        </div>

        {/* Game Over Message */}
        {gameOver && <GameIsOver score={score}/>}

        {/* Instructions */}
        <div className="absolute bottom-10 left-10 text-center text-[rgb(45,15,18)] text-2xl font-bold z-10" 
             style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
          <p>Aim and click to shoot arrows 🏹</p>
          <p className="text-red-600">Hit balloons but avoid bombs! 💣</p>
        </div>
        
        {/* Bow and Arrow */}
        <div 
          className='absolute bottom-0 right-[800px]'
          style={{ 
            transformOrigin: 'bottom center',
            cursor: canShoot ? 'pointer' : 'default',
            zIndex: 30
          }}
          onClick={shootArrow}
        >
          <img 
            ref={bowRef}
            className='w-48' 
            src={BowArrowImg}
            alt="Bow"
            style={{ 
              transform: `rotate(${bowRotation}deg)`,
              transformOrigin: 'center center'
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BalloonBurstGame;