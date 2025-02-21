import React, { useState ,useEffect} from 'react';
import "../App.css";
import { BASE_URL } from '../../config.jsx';
import { useNavigate,useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';

const OtpVerification = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const location=useLocation()

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/login'); // Redirect if email is not available
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      if (error) setError(''); // Clear error on valid input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim().length !== 6) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/auth/verifyOtp?email=${email}&otp=${otp}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        login(data.content.accessToken);
        navigate("/dashboard",{state:{user:data.content.data}});
      } else {
        setError(`${data.message}  Sorry, we can't log you in.` || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <div className="form-header">
          <h2>OTP Verification</h2>
          <p>Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              inputMode="numeric"
              maxLength={6}
              className={error ? "form-group-input error" : "form-group-input"}
            />
            {error && <span className="error">{error}</span>}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="form-group" style={{ textAlign: 'center' }}>
          Didn't receive the code? <a href="/login">Resend OTP</a>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
