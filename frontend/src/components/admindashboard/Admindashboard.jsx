import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import { FaTrophy, FaUsers, FaUser, FaFutbol, FaSearch } from "react-icons/fa";
import "../admindashboard/admindashboard.css";

const AdminDashboard = () => {
    const [totalLeagues, setTotalLeagues] = useState(0);
    const [totalTeams, setTotalTeams] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const [leagueDistribution, setLeagueDistribution] = useState({
        labels: [],
        datasets: []
    });
    const [matchTrends, setMatchTrends] = useState({
        labels: [],
        datasets: []
    });
    const [leagueTrends, setLeagueTrends] = useState({
        labels: [],
        datasets: []
    });
    const [users, setUsers] = useState([]);
    const [userSignUpTrends, setUserSignUpTrends] = useState({
        labels: [],
        datasets: []
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchTotalMetrics = async () => {
            try {
                const leaguesResponse = await axios.get(
                    "https://localhost:7031/api/League/leagues",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTotalLeagues(leaguesResponse.data.length);
                const teamsResponse = await axios.get(
                    "https://localhost:7031/api/Team/teams",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTotalTeams(teamsResponse.data.length);
                const playersResponse = await axios.get(
                    "https://localhost:7031/api/Player/players",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTotalPlayers(playersResponse.data.length);
                const matchesResponse = await axios.get(
                    "https://localhost:7031/api/Match/matches",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTotalMatches(matchesResponse.data.length);

                const monthCount = Array(12).fill(0);
                matchesResponse.data.forEach((match) => {
                    const month = new Date(match.matchDate).getMonth();
                    monthCount[month]++;
                });
                setMatchTrends({
                    labels: [
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ],
                    datasets: [
                        {
                            label: "Count",
                            data: monthCount,
                            backgroundColor: "#36A2EB"
                        }
                    ]
                });
            } catch (error) {
                console.error("Error fetching total metrics:", error);
            }
        };
        fetchTotalMetrics();
    }, [token]);

    useEffect(() => {
        const fetchLeagueDistribution = async () => {
            try {
                const leaguesResponse = await axios.get(
                    "https://localhost:7031/api/League/leagues",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const countryCount = {};
                leaguesResponse.data.forEach((league) => {
                    const country = league.country || "Unknown";
                    countryCount[country] = (countryCount[country] || 0) + 1;
                });
                setLeagueDistribution({
                    labels: Object.keys(countryCount),
                    datasets: [
                        {
                            label: "League Distribution",
                            data: Object.values(countryCount),
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#4BC0C0",
                                "#9966FF"
                            ]
                        }
                    ]
                });
            } catch (error) {
                console.error("Error fetching league distribution:", error);
            }
        };
        fetchLeagueDistribution();
    }, [token]);

    useEffect(() => {
        const fetchLeagueTrends = async () => {
            try {
                const leaguesResponse = await axios.get(
                    "https://localhost:7031/api/League/leagues",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const monthCount = Array(12).fill(0);
                leaguesResponse.data.forEach((league) => {
                    const createdDate = new Date(league.createdAt);
                    const month = createdDate.getMonth();
                    monthCount[month]++;
                });
                setLeagueTrends({
                    labels: [
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ],
                    datasets: [
                        {
                            label: "Count",
                            data: monthCount,
                            borderColor: "#FF6384",
                            backgroundColor: "rgb(213, 145, 145)",
                            fill: false,
                            tension: 0.1
                        }
                    ]
                });
            } catch (error) {
                console.error("Error fetching league trends:", error);
            }
        };
        fetchLeagueTrends();
    }, [token]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersResponse = await axios.get(
                    "https://localhost:7031/api/Users/getallusers",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [token]);

    useEffect(() => {
        if (users.length > 0) {
            const signupMonthCount = Array(12).fill(0);
            users.forEach(user => {
                const createdDate = new Date(user.createdAt);
                const month = createdDate.getMonth();
                signupMonthCount[month]++;
            });
            setUserSignUpTrends({
                labels: [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ],
                datasets: [
                    {
                        label: "Count",
                        data: signupMonthCount,
                        borderColor: "#4BC0C0",
                        backgroundColor: "rgba(75,192,192,0.2)",
                        fill: false,
                        tension: 0.1
                    }
                ]
            });
        }
    }, [users]);

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="admin-dashboard">
            <Sidebar />
            <div className="admin-content">
                <h1 className="dashboard-title" style={{ marginBottom: "2rem" }}>
                    Admin Dashboard
                </h1>
                <div className="metrics">
                    <div className="metric-item">
                        <FaTrophy className="metric-icon" />
                        <div className="metric-text">Leagues</div>
                        <div className="metric-value">{totalLeagues}</div>
                    </div>
                    <div className="metric-item">
                        <FaUsers className="metric-icon" />
                        <div className="metric-text">Teams</div>
                        <div className="metric-value">{totalTeams}</div>
                    </div>
                    <div className="metric-item">
                        <FaUser className="metric-icon" />
                        <div className="metric-text">Players</div>
                        <div className="metric-value">{totalPlayers}</div>
                    </div>
                    <div className="metric-item">
                        <FaFutbol className="metric-icon" />
                        <div className="metric-text">Matches</div>
                        <div className="metric-value">{totalMatches}</div>
                    </div>
                </div>
                <div className="charts">
                    <div className="chart-item">
                        <h3 className="chart-title">League Distribution</h3>
                        {leagueDistribution.datasets.length > 0 && (
                            <Pie data={leagueDistribution} />
                        )}
                    </div>
                    <div className="chart-item">
                        <h3 className="chart-title">Leagues Created</h3>
                        {leagueTrends.datasets.length > 0 && (
                            <Bar data={leagueTrends} />
                        )}
                    </div>
                    <div className="chart-item">
                        <h3 className="chart-title">Matches Organised</h3>
                        {matchTrends.datasets.length > 0 && (
                            <Line data={matchTrends} />
                        )}
                    </div>
                    <div className="chart-item">
                        <h3 className="chart-title">User Sign-Up Trends</h3>
                        {userSignUpTrends.datasets.length > 0 && (
                            <Line data={userSignUpTrends} />
                        )}
                    </div>
                </div>
                <div className="users-list">
                    <h2>Users List</h2>
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search Users..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Account Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={user.userId}>
                                    <td>{indexOfFirstUser + index + 1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                                    onClick={() => paginate(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="page-btn"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
