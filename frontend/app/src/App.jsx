import { Route, Routes } from "react-router-dom"
import Login from "./Pages/Login/Login"
import Signup from "./Pages/Signup/Signup"

function App() {
 

  return (
    <>
    <Routes>
     <Route path="/login" element={<Login/>}/>
     <Route path="/signup" element={<Signup/>}/> 
    </Routes>
    </>
  )
}

export default App
