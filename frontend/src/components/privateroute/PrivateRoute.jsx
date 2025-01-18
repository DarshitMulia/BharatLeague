import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const PrivateRoute = ({ element: Element, allowedRoles }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwt_decode(token);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/" />;
        }

        return <Element />;
    } catch (error) {
        console.error("Token decoding error:", error);
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
