const Trajectory=({index,point,windowSize})=>{

    const getTrajectoryDotSize = (index) => {
        const baseSize = windowSize.width < 640 ? 4 : windowSize.width < 1024 ? 6 : 8;
        return index % 2 === 0 ? `${baseSize}px` : `${baseSize - 2}px`;
      };
    return (
        <div
              key={`trajectory-${index}`}
              className="absolute rounded-full bg-black z-50"
              style={{
                width: getTrajectoryDotSize(index),
                height: getTrajectoryDotSize(index),
                left: `${point.x}px`,
                top: `${point.y}px`,
                zIndex: 15
              }}
            />
    )
}
export default Trajectory;