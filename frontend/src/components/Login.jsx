import { useState} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config.jsx";


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // login(data.content.accessToken); // Save token in context & localStorage
        navigate("/otp", { state: { email } });  // Redirect after successful login
      } else {
        setError(data.message || "Invalid credentials!");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <div className="form-header">
          <h2>Login</h2>
          <p>Access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <span className="error">{error}</span>}

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
