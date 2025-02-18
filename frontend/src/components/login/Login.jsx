import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./login.css";
import "../signup/signup.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "User",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "A valid email is required.";
            }
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        }

        if (!formData.role) {
            newErrors.role = "Role is required.";
        } else if (!["User", "Admin"].includes(formData.role)) {
            newErrors.role = "Role must be either 'User' or 'Admin'.";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            const response = await axios.post(
                "https://localhost:7031/api/Users/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const token = response.data.token;
            localStorage.setItem("authToken", token);

            const decodedToken = jwt_decode(token);
            console.log("Decoded Token:", decodedToken);

            const userRole =
                decodedToken[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ];
            console.log("User Role:", userRole);
            const userId =
                decodedToken[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ];
            console.log("UserId:", userId);

            localStorage.setItem("role", userRole);
            localStorage.setItem("userId", userId);

            setShowPopup(true);

            setTimeout(() => {
                if (userRole === "Admin") {
                    navigate("/admindashboard");
                } else if (userRole === "User") {
                    navigate("/");
                } else {
                    console.error("Unknown role:", userRole);
                    alert("Invalid role. Please contact support.");
                }
            }, 2000);
        } catch (error) {
            console.error("Error details:", error);

            if (error.response) {
                console.error("Backend error response:", error.response.data);
                alert(
                    "Backend error: " +
                    (error.response.data.message || "Something went wrong!")
                );
            } else if (error.request) {
                alert("No response from backend. Check network or CORS configuration.");
            } else {
                alert("Frontend error: " + error.message);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 id="form-heading">Login to BharatLeague</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            id="email"
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                id="password"
                            />
                            <span className="toggle-link" onClick={handleTogglePassword}>
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">
                            Role
                        </label>
                        <div className="role-options">
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="User"
                                    checked={formData.role === "User"}
                                    onChange={handleChange}
                                    className="form-check-input"
                                />
                                User
                            </label>
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="Admin"
                                    checked={formData.role === "Admin"}
                                    onChange={handleChange}
                                    className="form-check-input"
                                />
                                Admin
                            </label>
                        </div>
                        {errors.role && (
                            <div className="invalid-feedback d-block">{errors.role}</div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                    <p className="mt-3">
                        Don't have an account?{" "}
                        <span
                            className="toggle-link-login"
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </span>
                    </p>
                </form>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-content">
                            <span className="tick-emoji">✅</span>
                            <p>Login successful!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
