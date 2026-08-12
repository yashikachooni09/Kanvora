import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import MainLayout from "./Components/common/layout/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { Page } from "./Pages/MainPage/Page";
import BoardsPage from "./Pages/BoardPage/BoardPage";
import BoardDetails from "./Pages/BoardPage/BoardDetail";
import StarredPage from "./Pages/StarredPage/StarredPage";
import WorkspacePage from "./Pages/WorkspacePage/WorkspacePage";
import SearchResults from "./Pages/SearchResults/SearchResults";
import SettingsPage from "./Pages/SettingsPage/SettingsPage";

// ✅ Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} state={{ from: location }} replace />;
  }

  return children;
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

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

      <Route
        path="/starred"
        element={
          <PrivateRoute>
            <MainLayout>
              <StarredPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/workspace/:id"
        element={
          <PrivateRoute>
            <MainLayout>
              <WorkspacePage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/search"
        element={
          <PrivateRoute>
            <MainLayout>
              <SearchResults />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <MainLayout>
              <SettingsPage />
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