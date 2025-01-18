import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./login.css"

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "User"
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
                "https://localhost:7031/api/Users/login", formData,
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

            const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            console.log("User Role:", userRole);

            // Store the role in localStorage
            localStorage.setItem("role", userRole);

            if (userRole === "Admin") {
                navigate("/admindashboard");
            } else if (userRole === "User") {
                navigate("/");
            } else {
                console.error("Unknown role:", userRole);
                alert("Invalid role. Please contact support.");
            }
        } catch (error) {
            console.error("Error details:", error);

            if (error.response) {
                console.error("Backend error response:", error.response.data);
                alert("Backend error: " + (error.response.data.message || "Something went wrong!"));
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
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <p className="mt-3">
                        Don't have an account?
                        <span className="toggle-link-login" onClick={() => navigate("/signup")}>
                            Sign Up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
