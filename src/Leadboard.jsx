import { useSelector } from "react-redux";
import LeaderBoard from "./Graphics/leaderBoard.png";
import { useEffect, useRef, useState } from "react";
import Popup from "./Popup";
import GoldMedal from "./Graphics/gold.png";
import SilverMedal from "./Graphics/silver.png";
import BronzeMedal from "./Graphics/bronze.png";
import Coin from "./Graphics/coin.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const searchText = useRef();
  const [popup, setPopUp] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [fullySortedData, setFullySortedData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [AllUserData,setAllUserData]=useState([]);

  const getAllUser=async()=>{
    try{
      const ApiData=await fetch("http://172.16.16.237:81/api/Balloon/GetAllUsers");
    const allData=await ApiData.json();
    console.log("Leader board data",allData);
    setAllUserData(allData);
    }catch(err){
      console.log(err.message);
    }
  }


  useEffect(()=>{
    getAllUser();
  },[]);
  console.log("AllUserData",AllUserData);
  // Sort data only when allUserInfo changes
  useEffect(() => {
    const sorted = [...AllUserData].sort((a, b) => b.score - a.score);
    setSortedData(sorted);
    setFullySortedData(sorted);
  }, [AllUserData]);

  const searchTheName = () => {
    if (!searchText.current.value.trim()) {
      setSortedData(fullySortedData);
      setIsSearching(false);
      return;
    }

    let searchOP = fullySortedData.filter((userInfo) =>
      userInfo?.name.toLowerCase().includes(searchText.current.value.toLowerCase())
    );
    
    if (searchOP.length === 0) {
      setPopUp(true);
      setTimeout(() => {
        setPopUp(false);
      }, 2500);
    } else {
      setSortedData(searchOP);
      setIsSearching(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchTheName();
    } 
  };

  const handleClearSearch = () => {
    searchText.current.value = '';
    setSortedData(fullySortedData);
    setIsSearching(false);
  };
  const Nevigate=useNavigate();
  const BackToGame=()=>{
    Nevigate("/")

  }

  return (
    <>
      {popup && (
        <motion.div 
          className="fixed top-10 right-1/2 transform translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <Popup />
        </motion.div>
      )}
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white py-12">
        <div className="border-2 scale-[0.9] border-purple-500 rounded-2xl w-10/12 max-w-4xl flex flex-col justify-center items-center gap-6 px-5 py-6 bg-black bg-opacity-70 shadow-lg shadow-purple-500/30">
          <div className="flex justify-between gap-4 w-full max-w-md">
            {/* Search */}
            <div className="relative w-3/4">
              <input
                type="text"
                ref={searchText}
                onKeyPress={handleKeyPress}
                className="border-2 px-4 py-2 rounded-xl border-purple-500 text-xl font-semibold text-black focus:ring-2 focus:ring-purple-600 focus:outline-none w-full transition-all duration-300"
                placeholder="Search player..."
              />
              {isSearching && (
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </motion.button>
              )}
            </div>
            <motion.button
              onClick={searchTheName}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 px-4 py-2 rounded-xl border-purple-500 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
            >
              Search
            </motion.button>
          </div>

          <div className="border-2 border-purple-500 rounded-xl px-6 py-4 text-center relative w-full bg-gray-900 shadow-inner shadow-purple-500/20">
            {/* leaderboard title */}
            <div className="mb-6">
              <img className="mx-auto w-64" src={LeaderBoard} alt="Leaderboard" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent my-4"></div>
            </div>

            {/* Search status */}
            {isSearching && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-purple-300 mb-4"
              >
                Search results: {sortedData.length} player(s) found
              </motion.div>
            )}

            {/* Rank header */}
            <div className="flex items-center justify-between mb-5 text-lg font-bold text-purple-300 px-2">
              <p>Rank</p>
              <p>Medal</p>
              <p>Player</p>
              <p>Score</p>
            </div>

            {/* Player list with scrollbar */}
            <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              <section className="flex flex-col text-center gap-3">
                {sortedData &&
                  sortedData.map((user, index) => {
                    // Find the original rank of this user in the full list
                    const originalRank = fullySortedData.findIndex(u => u === user);
                    
                    return (
                      <motion.div
                        key={originalRank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          originalRank < 3
                            ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-purple-500/30"
                            : "bg-gray-800/50 hover:bg-gray-800 transition-all duration-300"
                        }`}
                      >
                        <p className="font-bold text-lg w-10">
                          {originalRank === 0 ? (
                            <span className="text-yellow-400">1</span>
                          ) : originalRank === 1 ? (
                            <span className="text-gray-300">2</span>
                          ) : originalRank === 2 ? (
                            <span className="text-yellow-700">3</span>
                          ) : (
                            originalRank + 1
                          )}
                        </p>
                        <div className="w-10">
                          {originalRank === 0 ? (
                            <motion.img
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              className="w-8 mx-auto"
                              src={GoldMedal}
                              alt="Gold medal"
                            />
                          ) : originalRank === 1 ? (
                            <motion.img
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              className="w-8 mx-auto"
                              src={SilverMedal}
                              alt="Silver medal"
                            />
                          ) : originalRank === 2 ? (
                            <motion.img
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              className="w-8 mx-auto"
                              src={BronzeMedal}
                              alt="Bronze medal"
                            />
                          ) : (
                            <p className="text-gray-500">--</p>
                          )}
                        </div>
                        <p className="font-medium text-lg text-white w-40 truncate">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1 font-bold text-lg">
                          <span className={originalRank < 3 ? "text-yellow-400" : "text-white"}>
                            {user.score}
                          </span>
                          <motion.img
                            animate={{ rotateY: [0, 360] }}
                            transition={{ repeat: Infinity, duration: 2, delay: index * 0.1 }}
                            className="w-5 inline-block"
                            src={Coin}
                            alt="Coin"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
              </section>
            </div>
          </div>
          

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-center text-gray-400 mt-2"
          >
            Top players win exclusive rewards
          </motion.div>
          <motion.button
              onClick={BackToGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 px-4 py-2 mb-5 rounded-xl border-purple-500 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
            >
              Back To Game
            </motion.button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #805AD5 0%, #4C51BF 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #6B46C1 0%, #4338CA 100%);
        }
      `}</style>
    </>
  );
};

export default Leaderboard;