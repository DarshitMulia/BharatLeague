import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
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

        if (!formData.username.trim()) {
            newErrors.username = "Username is required.";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters long.";
        } else if (formData.username.length > 50) {
            newErrors.username = "Username must not exceed 50 characters.";
        }

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
        } else {
            if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters long.";
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one uppercase letter.";
            } else if (!/[a-z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one lowercase letter.";
            } else if (!/[0-9]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one number.";
            } else if (!/[\!\@\#\$\%\^\&\*\(\)\-\+\=]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one special character (!,@,#,$,%,^,&,*,(,),-,+,=).";
            }
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
                "https://localhost:7031/api/Users/signup",
                formData
            );
            console.log(response.data);
            setShowPopup(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Error details:", error);
            if (error.response) {
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
        <div className="signup-page">
            <div className="signup-container">
                <h2 id="form-heading">Sign Up to BharatLeague</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`form-control ${errors.username ? "is-invalid" : ""}`}
                            id="username"
                        />
                        {errors.username && (
                            <div className="invalid-feedback">{errors.username}</div>
                        )}
                    </div>
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
                        Sign Up
                    </button>
                    <p className="mt-3">
                        Already have an account?{" "}
                        <span
                            className="toggle-link-signup"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-content">
                            <span className="tick-emoji">✅</span>
                            <p>SignUp successful!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
