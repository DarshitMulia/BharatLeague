import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

const Sidebar = () => {
    const [role, setRole] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        console.log("Role fetched in Sidebar:", storedRole);
        setRole(storedRole);
    }, []);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    <i className="fa fa-bars"></i>
                </button>
                {!collapsed && <h3>Bharat League</h3>}
            </div>
            <ul className="nav flex-column">
                {role === "Admin" && (
                    <>
                        <li className="nav-item">
                            <Link to="/admindashboard" className="nav-link">
                                <i className="fa fa-tachometer"></i>
                                {!collapsed && <span className="link-text">Admin Dashboard</span>}
                            </Link>
                        </li>
                        <hr />
                    </>
                )}

                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        <i className="fa fa-home"></i>
                        {!collapsed && <span className="link-text">Home</span>}
                    </Link>
                </li>
                <hr />
                <li className="nav-item">
                    <Link to="/createleague" className="nav-link">
                        <i className="fa fa-plus-circle"></i>
                        {!collapsed && <span className="link-text">Create League</span>}
                    </Link>
                </li>
                <hr />
                <li className="nav-item">
                    <Link to="/manageleague" className="nav-link">
                        <i className="fa fa-cogs"></i>
                        {!collapsed && <span className="link-text">Manage League</span>}
                    </Link>
                </li>
                <hr />
                <li className="nav-item">
                    <Link to="/leagues" className="nav-link">
                        <i className="fa fa-shield"></i>
                        {!collapsed && <span className="link-text">Leagues</span>}
                    </Link>
                </li>
                <hr />
                {/* <li className="nav-item">
                    <Link to="/teams" className="nav-link">
                        <i className="fa fa-users"></i>
                        {!collapsed && <span className="link-text">Teams</span>}
                    </Link>
                </li>
                <hr />
                <li className="nav-item">
                    <Link to="/players" className="nav-link">
                        <i className="fa fa-user"></i>
                        {!collapsed && <span className="link-text">Players</span>}
                    </Link>
                </li>
                <hr /> */}
                <li className="nav-item">
                    <Link to="/leaguestandings" className="nav-link">
                        <i className="fa fa-trophy"></i>
                        {!collapsed && <span className="link-text">Standings</span>}
                    </Link>
                </li>
                <hr />
                <li className="nav-item logout-btn">
                    <button className="nav-link" onClick={logout}>
                        <i className="fa fa-sign-out"></i>
                        {!collapsed && <span className="link-text">Logout</span>}
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
