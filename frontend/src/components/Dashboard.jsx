import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import "../App.css";
import { BASE_URL } from '../../config.jsx';

const Dashboard = () => {
  const { logout,authToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Check if the user is passed in the navigation state
    if (location.state && location.state.user) {
      setUser(location.state.user);
    } else {
      // If not, redirect to login since no user data is available
      navigate('/login');
    }
  }, [location, navigate]);
  console.log(user);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to login or home after logout
  };

  const handleDeleteAccount = async () => {

    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;
    // Add delete account logic here (API call if needed)
    try {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
        "Authorization":`Bearer ${authToken}` },
      });

      const data = await response.json();

      if (response.ok) {
        logout();
        navigate("/");
      } else {
        setError(`${data.message}` || "SOMETHING_WENT_WRONG");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1>THANK YOU!</h1>
        <div className="form-header">
          <h2>Welcome, {user?.name || "User"}!</h2>
          <p>Email: {user?.email || "N/A"}</p>
          <p>Company Name :{user?.companyName || "Test Company"}</p>
        </div>

        {user?.profilePhoto && (
          <div className="image-preview">
            <img src={user.profilePhoto} alt="Profile" />
          </div>
        )}

        <button className="submit-button" onClick={handleLogout}>
          Logout
        </button>

        <button 
          className="submit-button" 
          style={{ backgroundColor: '#dc2626' }} 
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
