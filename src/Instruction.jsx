const Instructions=({BombImg,windowSize})=>{
    const getFontSize = (type) => {
        if (type === 'header') {
          return windowSize.width < 640 ? 'text-lg' : windowSize.width < 1024 ? 'text-xl' : 'text-2xl';
        } else if (type === 'instruction') {
          return windowSize.width < 640 ? 'text-base' : windowSize.width < 1024 ? 'text-lg' : 'text-2xl';
        }
        return 'text-base';
      };
    return (
        <div
        className={`absolute bottom-[1%]  left-1/2  -translate-x-1/2  md:bottom-10  md:left-10  md:translate-x-0  text-center  text-white  font-bold  z-10 
          ${getFontSize('instruction')}
        `}
        style={{
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
      transformOrigin: 'bottom center',
        }}
      >
        <p
          className="bg-zinc-900/50 p-2 rounded-xl 
            hover:bg-zinc-900/50 hover:shadow-[0_0_30px_rgba(255,45,85,0.2)] 
            transition-all duration-300 transform
            text-white text-xs font-normal md:font-bold md:text-xl"
        >
          Hit 
          <img src={BombImg} className="w-5 md:w-14 ml-2 inline-block z-50" /> 
           and get extra +5 seconds
        </p>
      </div>
    )
}
export default Instructions;