import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import { FiPlus, FiUsers, FiEdit, FiArrowRight, FiUser } from 'react-icons/fi';
import './manageteam.css';

const ManageTeam = () => {
    const { leagueId } = useParams();
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const token = localStorage.getItem("authToken")
                const response = await axios.get(`https://localhost:7031/api/Team/league/${leagueId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTeams(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch teams. Please try again later.');
                console.error('Error fetching teams:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, [leagueId]);

    return (
        <div className="manage-team-container">
            <Sidebar />
            <div className="manage-team-main-content">
                <div className="content-header">
                    <h1>Manage Teams</h1>
                    <Link to={`/addteam/${leagueId}`} className="create-team-btn">
                        <FiPlus className="btn-icon" />
                        New Team
                    </Link>
                </div>
                {isLoading ? (
                    <div className="loading-state">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="team-skeleton">
                                <div className="skeleton-image"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <h3>Error Loading Teams</h3>
                        <p>{error}</p>
                    </div>
                ) : teams.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Teams Found Yet!</h3>
                        <p>Get started by adding a new team</p>
                    </div>
                ) : (
                    <div className="team-list">
                        {teams.map((team) => (
                            <div key={team.teamId} className="team-item">
                                <div className="team-main-info">
                                    <div className="team-information">
                                        {team.imageUrl && (
                                            <img
                                                src={team.imageUrl}
                                                alt={team.teamName}
                                                className="team-image"
                                            />
                                        )}
                                        <div className="team-text">
                                            <h4>{team.teamName}</h4>
                                            <div className="team-details">
                                                <span className="city-tag">
                                                    {team.city}
                                                </span>
                                                <span className="coach-information">
                                                    Manager: <b>{team.coachName}</b>
                                                </span>
                                                <span className="found-year">
                                                    Founded Year: <b>{team.foundedYear}</b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="team-actions-container">
                                    <Link to={`/viewplayers/${team.teamId}`} className="action-link">
                                        <FiUser className="link-icon" />
                                        Players
                                    </Link>
                                    <Link to={`/updateteam/${team.leagueId}/${team.teamId}`}
                                        className="action-link"
                                    >
                                        <FiEdit className="btn-link" />
                                        Edit Team
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTeam;