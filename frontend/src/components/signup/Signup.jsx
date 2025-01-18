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

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://localhost:7031/api/Users/signup",
                formData
            );
            console.log(response.data);
            alert(response.data.message || "Signup successful!");
            navigate("/login");
        } catch (error) {
            console.error("Error details:", error);
            if (error.response) {
                alert("Backend error: " + (error.response.data.message || "Something went wrong!"));
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
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-control"
                            id="username"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            id="email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-control"
                                id="password"
                                required
                            />
                            <span
                                className="toggle-link"
                                onClick={handleTogglePassword}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-control"
                            id="role"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                    <p className="mt-3">
                        Already have an account? <span className="toggle-link-signup" onClick={() => navigate("/login")}>Login</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
