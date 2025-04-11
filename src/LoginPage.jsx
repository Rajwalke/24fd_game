import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUserEmail, addUserId, addUserName } from "./utils/userDataSlice";
import { IoGameController } from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";

// Import balloon images
import balloon1 from './Graphics/heart.png';
import balloon2 from './Graphics/bandag.png';
import balloon3 from './Graphics/medicalbox.png';
import balloon4 from './Graphics/bloodBank.png';
import balloon5 from './Graphics/lungs.png';
import doctorImg from "./Graphics/doctor image.png"

const LoginPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [emailError, setEmailError] = useState("");
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

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const goToGame = () => {
        // Reset error messages
        setErrorMessage("");
        setEmailError("");
        
        // Validate name
        if (!fullName.trim()) {
            setErrorMessage("Please enter your name first");
            setFullName("");
            return;
        }
        
        const invalidChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "@", "#", "$", "%", "&", "*", "!", "?"];
        if (fullName.split("").some(char => invalidChars.includes(char))) {
            setErrorMessage("Only alphabets and spaces are allowed in name.");
            setFullName("");
            return;
        }
        
        // Validate email
        if (!email.trim()) {
            setEmailError("Please enter your email");
            return;
        }
        
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        
        // If all validations pass, proceed
        dispatch(addUserId(id));
        dispatch(addUserName(fullName));
        dispatch(addUserEmail(email));
        
        // Save email to localStorage
        localStorage.setItem("userEmail", email);
        
        setId(prevId => {
            const newId = prevId + 1;
            localStorage.setItem("userId", newId);
            return newId;
        });
   
        navigate("/Game");
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Clear email error when user starts typing again
        if (emailError) setEmailError("");
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
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>
            
            {/* Main content container */}
            <div className={`relative z-10 w-full max-w-sm mx-auto scale-75 md:scale-90 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Balloon design - adjusted positions */}
                <div className="absolute -top-12 -right-12 opacity-70">
                    <img src={balloonImages[0]} alt="Balloon" className="w-24 h-auto" />
                </div>
                <div className="absolute -top-32 right-[32%] opacity-100">
                    <img src={doctorImg} alt="Doctor" className="w-36 h-auto" />
                </div>

                <div className="absolute -bottom-12 -left-12 opacity-70">
                    <img src={balloonImages[2]} alt="Balloon" className="w-24 h-auto" />
                </div>
                
                {/* Login container */}
                <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header area */}
                    <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-6 py-4 border-b border-gray-700">
                        <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
                            Doctor's Aim
                        </h1>
                        <p className="text-gray-300 mt-1 text-xs">
                            Challenge your reflexes in this captivating Medical-objects-popping adventure
                        </p>
                    </div>
                    
                    {/* Form area */}
                    <div className="px-6 py-6">
                        <form onSubmit={(event) => event.preventDefault()}>
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="fullName" className="block text-xs font-medium text-gray-200 mb-1">
                                            PLAYER NAME
                                        </label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                                if (errorMessage) setErrorMessage("");
                                            }}
                                            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-sm"
                                            placeholder="Enter your name"
                                        />
                                        {errorMessage && (
                                            <p className="mt-1 text-red-400 text-xs">{errorMessage}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-xs font-medium text-gray-200 mb-1">
                                            PLAYER EMAIL
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-white border ${emailError ? 'border-red-500' : 'border-gray-600'} focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-sm`}
                                            placeholder="Enter your email"
                                        />
                                        {emailError && (
                                            <p className="mt-1 text-red-400 text-xs">{emailError}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-2 pt-2">
                                    <button 
                                        onClick={goToGame} 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                                    >
                                        Start the Game <IoGameController className="inline-block text-lg" />
                                    </button>
                                    <Link to="/leaderboard"
                                        className="w-full bg-gradient-to-r block text-center from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                                    >
                                      LeadBoard <MdLeaderboard className="inline-block" />
                                    </Link>      
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    {/* Footer area */}
                    <div className="bg-gray-900 bg-opacity-70 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={balloonImages[1]} alt="Balloon icon" className="w-4 h-auto mr-1" />
                            <span className="text-gray-400 text-xs">High scores tracked</span>
                        </div>
                        <div className="text-gray-400 text-xs">Premium Edition</div>
                    </div>
                </div>
                
                {/* Decorative element */}
                <div className="flex justify-center mt-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
            </div>
            
            {/* Balloon animation in background - reduced sizes */}
            {[...Array(8)].map((_, i) => {
                const randomImage = balloonImages[Math.floor(Math.random() * balloonImages.length)];
                const randomSize = Math.random() * 20 + 30; // Reduced size
                const randomLeft = Math.random() * 100;
                const randomDelay = Math.random() * 6;
                const randomDuration = Math.random() * 10 + 12;
                
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