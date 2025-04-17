const BowandArrow=({canShoot,shootArrow,bowRef,BowArrowImg,bowRotation,windowSize})=>{
      // Determine bow size based on screen size
  const getBowSize = () => {
    if (windowSize.width < 640) return 'w-24'; // Mobile
    if (windowSize.width < 1024) return 'w-32'; // Tablet
    return 'w-44'; // Desktop and larger
  };


    
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