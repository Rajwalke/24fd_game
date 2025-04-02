import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUserId, addUserName } from "./utils/userDataSlice";
import { IoGameController } from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";

// Import balloon images
import balloon1 from './Graphics/Symbol 100001.png';
import balloon2 from './Graphics/Symbol 100002.png';
import balloon3 from './Graphics/Symbol 100003.png';
import balloon4 from './Graphics/Symbol 100004.png';
import balloon5 from './Graphics/Symbol 100005.png';

const LoginPage = () => {
    const [fullName, setFullName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [id, setId] = useState(() => Number(localStorage.getItem("userId")) || 0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    // Balloon images array
    const balloonImages = [
        balloon1, 
        balloon2, 
        balloon3, 
        balloon4, 
        balloon5, 
    ];

    useEffect(() => {
        localStorage.setItem("userId", id);
        
        // Add animation class after component mounts
        setTimeout(() => {
            setIsLoaded(true);
        }, 100);
    }, [id]);

    const goToGame = () => {
        if (!fullName.trim()) {
            setErrorMessage("Please Enter your Name First");
            setFullName("");
            return;
        }
        
        const invalidChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "@", "#", "$", "%", "&", "*", "!", "?"];
        if (fullName.split("").some(char => invalidChars.includes(char))) {
            setErrorMessage("Only alphabets and spaces are allowed.");
            setFullName("");
            return;
        }
        
        dispatch(addUserId(id));
        dispatch(addUserName(fullName));
        setId(prevId => {
            const newId = prevId + 1;
            localStorage.setItem("userId", newId);
            return newId;
        });
   
        navigate("/Game");
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background design */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-0"></div>
            
            {/* Subtle particle effect */}
            <div className="absolute inset-0 z-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>
            
            {/* Main content container */}
            <div className={`relative z-10 w-full max-w-md mx-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Balloon design - more subtle and elegant */}
                <div className="absolute -top-16 -right-16 opacity-70">
                    <img src={balloonImages[0]} alt="Balloon" className="w-32 h-auto" />
                </div>
                <div className="absolute -bottom-16 -left-16 opacity-70">
                    <img src={balloonImages[2]} alt="Balloon" className="w-32 h-auto" />
                </div>
                
                {/* Login container */}
                <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header area */}
                    <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-8 py-6 border-b border-gray-700">
                        <h1 className="font-bold text-3xl md:text-4xl text-white tracking-tight">
                            BURST THE BALLOON
                        </h1>
                        <p className="text-gray-300 mt-2 text-sm">
                            Challenge your reflexes in this captivating balloon-popping adventure
                        </p>
                    </div>
                    
                    {/* Form area */}
                    <div className="px-8 py-8">
                        <form onSubmit={(event) => event.preventDefault()}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-200 mb-2">
                                        PLAYER NAME
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                        placeholder="Enter your name"
                                    />
                                    {errorMessage && (
                                        <p className="mt-2 text-red-400 text-sm">{errorMessage}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2 text-xl  font-semibold">
                                    <button 
                                        onClick={goToGame} 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Start the Game <IoGameController className="inline-block text-xl" />
                                    </button>
                                    <Link to="/leaderboard"
        
                                        className="w-full bg-gradient-to-r text-xl block text-center from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                      LeadBoard <MdLeaderboard className="inline-block" /></Link>      
                                    
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    {/* Footer area */}
                    <div className="bg-gray-900 bg-opacity-70 px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={balloonImages[1]} alt="Balloon icon" className="w-6 h-auto mr-2" />
                            <span className="text-gray-400 text-sm">High scores tracked</span>
                        </div>
                        <div className="text-gray-400 text-sm">Premium Edition</div>
                    </div>
                </div>
                
                {/* Decorative element */}
                <div className="flex justify-center mt-4">
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
            </div>
            
            {/* Faster balloon animation in background */}
            {[...Array(8)].map((_, i) => {
                const randomImage = balloonImages[Math.floor(Math.random() * balloonImages.length)];
                const randomSize = Math.random() * 30 + 40;
                const randomLeft = Math.random() * 100;
                const randomDelay = Math.random() * 6; // Reduced delay
                const randomDuration = Math.random() * 10 + 12; // Much faster duration (was 30+40)
                
                return (
                    <div 
                        key={i}
                        className="absolute z-0 opacity-20"
                        style={{
                            left: `${randomLeft}%`,
                            bottom: '-100px',
                            animation: `floatUp ${randomDuration}s linear infinite`,
                            animationDelay: `${randomDelay}s`
                        }}
                    >
                        <img 
                            src={randomImage} 
                            alt="Balloon" 
                            style={{
                                width: `${randomSize}px`,
                                height: 'auto',
                            }}
                        />
                    </div>
                );
            })}
            
            <style jsx>{`
                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
                    10% { opacity: 0.2; }
                    90% { opacity: 0.2; }
                    100% { transform: translateY(-120vh) rotate(10deg); opacity: 0; }
                }
                @keyframes twinkle {
                    0% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;