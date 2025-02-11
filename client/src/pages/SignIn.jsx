import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import toast styles
import "./SignIn.css"; // Reusing the same styles
import { useDispatch, useSelector } from 'react-redux'
import { signInStart,signInFailure,signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/Oauth";

export default function SignIn() {
    const [formData, setFormData] = useState({});
    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(false);
    const { loading, error}= useSelector((state)=>state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(signInStart());
            //setLoading(true);
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            
            if (data.success === false) {
                // setLoading(false);
                // setError(data.message);
                dispatch(signInFailure(data.message));  //redux added
                toast.error("Invalid email or password"); // ❌ Show error toast
                return;
            }

            // setLoading(false);
            // setError(null);
            dispatch(signInSuccess(data)); //redux added
            toast.success("Login successful! Redirecting..."); // ✅ Success message
            setTimeout(() => navigate("/"), 2000); // Redirect to home page after 2 seconds
            
        } catch (error) {
            // setLoading(false);
            // setError(error.message);
            dispatch(signInFailure(error.message)); //redux added
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="signin-container">
            <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Toast Container */}
            <div className="signin-box">
                <form className="signin-form" onSubmit={handleSubmit}>
                    <span className="title">Sign in</span>
                    <span className="subtitle">Welcome back! Please log in.</span>

                    <div className="form-container">
                        <input type="email" placeholder="Email" className="input" id="email" required onChange={handleChange}/>
                        <input type="password" placeholder="Password" className="input" id="password" required onChange={handleChange}/>
                    </div>

                    <button disabled={loading} className="signup-button">
                        {loading ? 'Loading...' : 'Sign In'}
                    </button>
                </form>

                {error && <p className="error">Invalid credentials</p>}

                <OAuth/>




                <div className="form-section">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="login-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
