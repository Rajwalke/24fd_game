const Userboard=({fullName,tierStatusText,timeLeft,score})=>{

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      };
  
    return(
        <div className="fixed top-0 right-0 z-40 m-2 md:m-4">
  {/* Container that adapts to screen size */}
  <div className="w-full max-w-[90vw] sm:max-w-[280px] bg-black/80 backdrop-blur-sm rounded-lg border-2 border-yellow-400 shadow-lg overflow-hidden">
    {/* Header with player info - stack on very small screens, side by side otherwise */}
    <div className="p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white mx-auto sm:mx-0">
          <span className="text-white text-sm font-bold">{fullName?.[0] || 'P'}</span>
        </div>
        <div className="text-center sm:text-left">
          <div className="text-yellow-300 font-bold text-sm sm:text-base">
            {fullName || 'Player'}
          </div>
          <div className="text-white text-xs">
            {tierStatusText}
          </div>
        </div>
      </div>
    </div>
    
    {/* Score Display - Full width and clear */}
    <div className="px-2 sm:px-3 pb-2">
      <div className="p-1.5 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-md border border-indigo-300">
        <div className="flex justify-between items-center">
          <span className="text-white font-bold text-xs sm:text-sm">SCORE</span>
          <span className="text-xl font-black text-yellow-300 tabular-nums">{score}</span>
        </div>
      </div>
    </div>
    
    {/* Timer Section - Simplified for all screen sizes */}
    <div className="px-2 sm:px-3 pb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white font-bold text-xs">TIME</span>
        <span className={`font-bold ${
          timeLeft <= 10 ? 'text-red-500' : 
          timeLeft <= 30 ? 'text-orange-400' : 'text-green-400'
        } tabular-nums text-sm`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      {/* Timer Bar - Simple but effective */}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000"
          style={{ 
            width: `${Math.max((timeLeft / 60) * 100, 3)}%`,
            background: timeLeft <= 10 
              ? '#ef4444' 
              : timeLeft <= 30 
                ? '#f59e0b' 
                : '#22c55e'
          }}
        />
      </div>
    </div>
  </div>
</div>
    )
}
export default Userboard;