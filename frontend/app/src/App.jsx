import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import MainLayout from "./Components/common/layout/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { Page } from "./Pages/MainPage/Page";

function App() {
  return (
    <MainLayout>
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Dashboard/>}/>

      {/* Auth routes */}
      <Route path="/page" element={<Page/>}/>
      {/* <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> */}

      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
    </MainLayout>
  );
}

export default App;