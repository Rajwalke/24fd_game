// const ArrowImgComponent=({arrow,arrowSize,ArrowImg})=>{
//     return(
//         <img 
//                         id={`arrow-${arrow.id}`}
//                         key={arrow.id}
//                         src={ArrowImg}
//                         alt="Arrow"
//                         className="absolute animate-arrow"
//                         style={{
//                           width: arrowSize.width,
//                           height: arrowSize.height,
//                           left: `${arrow.x}px`,
//                           top: `${arrow.y}px`,
//                           '--arrow-rotation': `${arrow.rotation}deg`,
//                           '--arrow-dx': `${arrow.dx}px`,
//                           '--arrow-dy': `${arrow.dy}px`,
//                           transform: `rotate(${arrow.rotation}deg)`,
//                           transformOrigin: 'center center',
//                           zIndex: 20
//                         }}
//                       />
//     )
// };
// export default ArrowImgComponent;