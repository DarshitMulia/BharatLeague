import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../sidebar/Sidebar";
import { FiEdit, FiArrowRight, FiPlus } from 'react-icons/fi';
import './manageLeague.css';
import { Link, useNavigate } from 'react-router-dom';

const ManageLeague = () => {
    const [leagues, setLeagues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.error('User ID not found. Please log in.');
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchLeagues();
        }
    }, [userId]);

    const fetchLeagues = async () => {
        setIsLoading(true);
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found. User might not be authenticated.');
            }

            // Include the token in the Authorization header
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.get(`https://localhost:7031/api/League/user/${userId}`, config);
            setLeagues(response.data);
        } catch (err) {
            console.error('Unexpected error fetching leagues:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditLeague = async (leagueId) => {
        const leagueToEdit = leagues.find((league) => league.leagueId === leagueId);
        if (!leagueToEdit) {
            console.error('League not found.');
            return;
        }
        navigate(`/updateleague/${leagueId}`);
    };

    return (
        <div className="manage-league-container">
            <Sidebar />
            <div className="manage-league-main-content">
                <div className="content-header">
                    <h1>Manage Leagues</h1>
                    <a href="/createleague" className="create-league-button">
                        <FiPlus className="btn-icon" />
                        New League
                    </a>
                </div>
                {isLoading ? (
                    <div className="loading-state">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="league-skeleton">
                                <div className="skeleton-image"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        ))}
                    </div>
                ) : leagues.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Leagues Found Yet!</h3>
                        <p>Get started by creating a new league.</p>
                    </div>
                ) : (
                    <div className="league-list">
                        {leagues.map((league) => (
                            <div key={league.leagueId} className="league-item">
                                <div className="league-main-info">
                                    <div className="league-info">
                                        {league.imageUrl && (
                                            <img
                                                src={league.imageUrl}
                                                alt={league.leagueName}
                                                className="league-image"
                                            />
                                        )}
                                        <div className="league-text">
                                            <h4>{league.leagueName}</h4>
                                            <span className="country-tag">
                                                {league.country}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="league-dates">
                                        <b>
                                            {new Date(league.startDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })} - {new Date(league.endDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </b>
                                    </div>
                                </div>
                                <div className="league-actions-container">
                                    <Link to={`/viewteams/${league.leagueId}`}
                                        className="teams-link"
                                    >
                                        <FiArrowRight className="link-icon" />
                                        View Teams
                                    </Link>
                                    <button
                                        onClick={() => handleEditLeague(league.leagueId)}
                                        className="action-btn"
                                    >
                                        <FiEdit className="btn-icon" />
                                        Edit League
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLeague;
