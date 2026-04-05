import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import MainLayout from "./Components/common/layout/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { Page } from "./Pages/MainPage/Page";
import BoardsPage from "./Pages/BoardPage/BoardPage";
import BoardDetails from "./Pages/BoardPage/BoardDetail";

// ✅ Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // auto login check
    setLoading(false);
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <Routes>

      {/* ✅ Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/page"
        element={
          <PrivateRoute>
            <MainLayout>
              <Page />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/boards"
        element={
          <PrivateRoute>
            <MainLayout>
              <BoardsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
  path="/boards/:id"
  element={
    <PrivateRoute>
      <MainLayout>
        <BoardDetails />
      </MainLayout>
    </PrivateRoute>
  }
/>
      {/* ✅ Catch all */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;