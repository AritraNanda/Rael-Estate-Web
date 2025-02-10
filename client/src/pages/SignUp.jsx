import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import toast styles
import "./SignUp.css"; 

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                toast.error("Email already exists"); // ❌ Show error toast
                return;
            }

            setLoading(false);
            setError(null);
            toast.success("Account created successfully! Redirecting..."); // ✅ Success message
            setTimeout(() => navigate("/signin"), 2000); // Redirect after 2 seconds
            
        } catch (error) {
            setLoading(false);
            setError(error.message);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Add this */}
            <div className="signup-box">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <span className="title">Sign up</span>
                    <span className="subtitle">Create a free account with your email.</span>

                    <div className="form-container">
                        <input type="text" placeholder="Full Name" className="input" id="username" required onChange={handleChange}/>
                        <input type="email" placeholder="Email" className="input" id="email" required onChange={handleChange}/>
                        <input type="password" placeholder="Password" className="input" id="password" required onChange={handleChange}/>
                    </div>

                    <button disabled={loading} className="signup-button">
                        {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>

                {error && <p className="error">Email already exists</p>}

                <div className="form-section">
                    <p>
                        Have an account?{" "}
                        <Link to="/signin" className="login-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
