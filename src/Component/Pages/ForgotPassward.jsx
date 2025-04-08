import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgetPasswardChange } from "../Services/Operations/ProductAPI";
import "../Style/login.css";

const ForgotPassward = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { loginData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("email : ",email)
      const response = await forgetPasswardChange({ email });
      console.log("Forget password response: ", response);

      if (response.success === true) {
        setMessage("Password reset email sent successfully go to login page!");
      } else {
        setMessage("Failed to send password reset email. Please try again.");
      }
    } catch (error) {
      console.error("Error in forgot password: ", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="login-phone">
            <label htmlFor="email">Enter your email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="login-input"
            />
          </div>
          <button type="form-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {message && <p className="forgot-password-message">{message}</p>}
        </form>
        <button
          onClick={() => navigate("/login")}
          style={{
            border: "none",
            width: "100%",
            textAlign: "end",
            backgroundColor: "transparent",
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassward;
