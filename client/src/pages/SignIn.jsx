import React from "react";
import { Link } from "react-router-dom";
import "./SignIn.css"; // Import the CSS file

export default function SignIn() {
  return (
    <div className="signin-container">
      <div className="signin-box">
        <form className="signin-form">
          <span className="title">Sign In</span>
          <span className="subtitle">Welcome back! Please enter your details.</span>

          <div className="form-container">
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
          </div>

          <button className="signin-button">Sign In</button>
        </form>

        <div className="form-section">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
