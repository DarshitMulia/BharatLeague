// import React, { useEffect, useState } from "react";
// import "./sidebar.css";
// import { Link, useNavigate } from "react-router-dom";
// import "font-awesome/css/font-awesome.min.css";

// const Sidebar = () => {
//     const [role, setRole] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedRole = localStorage.getItem("role");
//         console.log("Role fetched in Sidebar:", storedRole);
//         setRole(storedRole);
//     }, []);

//     const logout = () => {
//         localStorage.clear();
//         navigate("/login");
//     };

//     return (
//         <div className="text-white p-3 vh-100 sidebar">
//             <h3 className="text-center">Bharat League</h3>
//             <ul className="nav flex-column mt-4">
//                 {role === "Admin" && (
//                     <>
//                         <li className="nav-item">
//                             <Link to="/admindashboard" className="nav-link text-white">
//                                 <i className="fa fa-tachometer"></i> Admin Dashboard
//                             </Link>
//                         </li>
//                     </>
//                 )}
//                 <li className="nav-item">
//                     <Link to="/" className="nav-link text-white">
//                         <i className="fa fa-home"></i> Home
//                     </Link>
//                 </li>
//                 <li className="nav-item">
//                     <Link to="/createleague" className="nav-link text-white">
//                         <i className="fa fa-plus-circle"></i> Create League
//                     </Link>
//                 </li>
//                 <li className="nav-item">
//                     <Link to="/manageleague" className="nav-link text-white">
//                         <i className="fa fa-cogs"></i> Manage League
//                     </Link>
//                 </li>
//                 <li className="nav-item">
//                     <Link to="/teams" className="nav-link text-white">
//                         <i className="fa fa-users"></i> Teams
//                     </Link>
//                 </li>
//                 <li className="nav-item">
//                     <Link to="/players" className="nav-link text-white">
//                         Players
//                     </Link>
//                 </li>
//                 <li className="nav-item">
//                     <Link to="/leaguestandings" className="nav-link text-white">
//                         <i className="fa fa-trophy"></i> League Standings
//                     </Link>
//                 </li>
//                 <li className="mt-3">
//                     <button className="btn btn-danger w-100" onClick={logout}>
//                         <i className="fa fa-sign-out"></i> Logout
//                     </button>
//                 </li>
//             </ul>
//         </div>
//     );
// };

// export default Sidebar;






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
            <ul className="nav flex-column mt-4">
                {role === "Admin" && (
                    <li className="nav-item">
                        <Link to="/admindashboard" className="nav-link text-white">
                            <i className="fa fa-tachometer"></i> {!collapsed && "Admin Dashboard"}
                        </Link>
                    </li>
                )}
                <li className="nav-item">
                    <Link to="/" className="nav-link text-white">
                        <i className="fa fa-home"></i> {!collapsed && "Home"}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/createleague" className="nav-link text-white">
                        <i className="fa fa-plus-circle"></i> {!collapsed && "Create League"}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/manageleague" className="nav-link text-white">
                        <i className="fa fa-cogs"></i> {!collapsed && "Manage League"}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/teams" className="nav-link text-white">
                        <i className="fa fa-users"></i> {!collapsed && "Teams"}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/players" className="nav-link text-white">
                        <i className="fa fa-user"></i> {!collapsed && "Players"}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/leaguestandings" className="nav-link text-white">
                        <i className="fa fa-trophy"></i> {!collapsed && "League Standings"}
                    </Link>
                </li>
                <li className="mt-3">
                    <button className="btn btn-danger w-100" onClick={logout}>
                        <i className="fa fa-sign-out"></i> {!collapsed && "Logout"}
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
