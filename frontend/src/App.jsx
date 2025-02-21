import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import OtpVerification from "./components/OtpVerification.jsx";

function App() {
  const { authToken } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={authToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/otp" element={<OtpVerification/>} />
      </Routes>
    </Router>
  );
}

export default App;
