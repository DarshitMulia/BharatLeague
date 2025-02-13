import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import "./sidebar.css";

const Sidebar = () => {
    const [role, setRole] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        console.log("Role fetched in Sidebar:", storedRole);
        setRole(storedRole);
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            <nav className={`sidebar ${isOpen ? "active" : ""}`} aria-label="Main Navigation">
                <div className="sidebar-header">
                    <h3>Bharat League</h3>
                    <button
                        className="sidebar-close"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close Sidebar"
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </div>
                <ul className="nav flex-column">
                    {role === "Admin" && (
                        <>
                            <li className="nav-item">
                                <NavLink
                                    to="/admindashboard"
                                    className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <i className="fa fa-tachometer"></i>
                                    <span className="link-text">Admin Dashboard</span>
                                </NavLink>
                            </li>
                            <hr />
                        </>
                    )}
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="fa fa-home"></i>
                            <span className="link-text">Home</span>
                        </NavLink>
                    </li>
                    <hr />
                    <li className="nav-item">
                        <NavLink
                            to="/createleague"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="fa fa-plus-circle"></i>
                            <span className="link-text">Create League</span>
                        </NavLink>
                    </li>
                    <hr />
                    <li className="nav-item">
                        <NavLink
                            to="/manageleague"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="fa fa-cogs"></i>
                            <span className="link-text">Manage League</span>
                        </NavLink>
                    </li>
                    <hr />
                    <li className="nav-item">
                        <NavLink
                            to="/leagues"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="fa fa-shield"></i>
                            <span className="link-text">Leagues</span>
                        </NavLink>
                    </li>
                    <hr />
                    <li className="nav-item">
                        <NavLink
                            to="/leaguestandings"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="fa fa-trophy"></i>
                            <span className="link-text">League Standings</span>
                        </NavLink>
                    </li>
                    <hr />
                    <li className="nav-item logout-btn">
                        <button className="nav-link" onClick={logout}>
                            <i className="fa fa-sign-out"></i>
                            <span className="link-text">Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
            {!isOpen && (
                <button
                    className="sidebar-toggle"
                    onClick={() => setIsOpen(true)}
                    aria-label="Toggle Sidebar"
                >
                    <i className="fa fa-bars"></i>
                </button>
            )}
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;
