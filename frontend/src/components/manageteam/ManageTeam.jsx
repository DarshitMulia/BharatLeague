import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import { FiPlus, FiUsers, FiEdit, FiArrowRight } from 'react-icons/fi';
import './manageteam.css';

const ManageTeam = () => {
    const { leagueId } = useParams();
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`https://localhost:7031/api/Team/league/${leagueId}`);
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
                    <a href={`/createteam/${leagueId}`} className="create-team-btn">
                        <FiPlus className="btn-icon" />
                        New Team
                    </a>
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
                        <h3>No Teams Found</h3>
                        <p>Get started by creating a new team</p>
                        <a href={`/createteam/${leagueId}`} className="create-team-btn">
                            <FiPlus className="btn-icon" />
                            Create Team
                        </a>
                    </div>
                ) : (
                    <div className="team-list">
                        {teams.map((team) => (
                            <div key={team.teamId} className="team-item">
                                <div className="team-main-info">
                                    <div className="team-info">
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
                                                <span className="coach-info">
                                                    Coach: <b>{team.coachName}</b>
                                                </span>
                                                <span className="founded-year">
                                                    Founded Year: <b>{team.foundedYear}</b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="team-actions-container">
                                    <a
                                        href={`/viewplayers/${team.teamId}`}
                                        className="view-link"
                                    >
                                        <FiArrowRight className="link-icon" />
                                        View Players
                                    </a>
                                    <a
                                        href={`/editteam/${team.teamId}`}
                                        className="action-btn"
                                    >
                                        <FiEdit className="btn-icon" />
                                        Edit Team
                                    </a>
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