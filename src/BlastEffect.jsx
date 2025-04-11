const BlastEffect=({blastSize,blast})=>{
    return (
        <div 
        key={`blast-${blast.id}`}
        className="absolute rounded-full animate-blast"
        style={{
          width: blastSize.size,
          height: blastSize.size,
          left: `${blast.x - parseInt(blastSize.size) / 2}px`,
          top: `${blast.y - parseInt(blastSize.size) / 2}px`,
          background: 'radial-gradient(circle, rgba(255,165,0,0.8) 0%, rgba(255,69,0,0.8) 40%, rgba(255,0,0,0.8) 60%, rgba(139,0,0,0.7) 80%, rgba(0,0,0,0) 100%)',
          boxShadow: '0 0 20px 10px rgba(255, 165, 0, 0.8)',
          zIndex: 30
        }}
      />
    )
}
export default BlastEffect;