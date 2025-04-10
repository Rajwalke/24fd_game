const BowandArrow=({canShoot,shootArrow,bowRef,BowArrowImg,bowRotation,windowSize})=>{
      // Determine bow size based on screen size
  const getBowSize = () => {
    if (windowSize.width < 640) return 'w-24'; // Mobile
    if (windowSize.width < 1024) return 'w-32'; // Tablet
    return 'w-60'; // Desktop and larger
  };


      // Shoot arrow function - now can be triggered by clicking anywhere on screen
    //   const shootArrow = useCallback(() => {
    //     if (!canShoot || gameOver || !trajectoryPoints.length || !bowRef.current || !gameAreaRef.current) return;
    //     // Get bow position
    //     const bowRect = bowRef.current.getBoundingClientRect();
    //     const bowCenterX = bowRect.left + bowRect.width / 2;
    //     const bowCenterY = bowRect.top + bowRect.height / 2;
        
    //     // Get game area for relative positioning
    //     const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
        
    //     // Calculate the exact start position of the arrow relative to game area
    //     const arrowStartX = bowCenterX - gameAreaRect.left;
    //     const arrowStartY = bowCenterY - gameAreaRect.top;
        
    //     // Calculate arrow path based on bow rotation
    //     const angleRad = bowRotation * (Math.PI / 180);
        
    //     // Set a fixed distance for arrow travel - large enough to cross entire screen on any display size
    //     // Calculate based on screen dimensions to ensure arrows travel fully across the screen
    //     const arrowDistance = Math.max(windowSize.width * 2, windowSize.height * 2);
    //     const dx = Math.cos(angleRad) * arrowDistance;
    //     const dy = Math.sin(angleRad) * arrowDistance;
        
    //     // Create new arrow with coordinates
    //     const newArrow = {
    //       id: Date.now(),
    //       x: arrowStartX,
    //       y: arrowStartY,
    //       rotation: bowRotation,
    //       dx: dx,
    //       dy: dy,
    //       active: true,
    //       // Add hitbox data for more accurate collision detection
    //       hitbox: {
    //         width: 10, // Arrow tip width for collision
    //         height: 10  // Arrow tip height for collision
    //       }
    //     };
        
    //     setArrows(prev => [...prev, newArrow]);
        
    //     // Cooldown for shooting
    //     setCanShoot(false);
    //     setTimeout(() => setCanShoot(true), 500);
    //   }, [bowRotation, canShoot, gameOver, trajectoryPoints.length, windowSize]);
    
    return(
        <div 
        className="absolute transform -translate-x-1/2 flex justify-center items-center"
        style={{ 
          bottom: '10%',
          left: '50%',
          transformOrigin: 'bottom center',
          cursor: canShoot ? 'pointer' : 'default',
          zIndex: 30
        }}
        onClick={shootArrow}
        onTouchStart={canShoot ? shootArrow : undefined}
      >
        <img 
          ref={bowRef}
          className={getBowSize()}
          src={BowArrowImg}
          alt="Bow"
          style={{ 
            transform: `rotate(${bowRotation}deg)`,
            transformOrigin: 'center center'
          }}
        />
      </div>
    )
}
export default BowandArrow;