import { BrowserRouter, Route, Routes } from "react-router-dom"
import BalloonBurstGame from "./BallonBrust"
import LoginPage from "./LoginPage"
import Leadboard from "./Leadboard"
import Rules from "./Rules"

const App=()=> {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/Game" element={ <BalloonBurstGame/>}/>
          <Route path="/leaderboard" element={<Leadboard/>}></Route>
          <Route path="/Rule" element={<Rules/>} ></Route>
        </Routes>
      </BrowserRouter>

  )
}

export default App;

