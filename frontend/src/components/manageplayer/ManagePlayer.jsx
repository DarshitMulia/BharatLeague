import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import { FiPlus, FiEdit } from 'react-icons/fi';
import { RiUserLine } from 'react-icons/ri';
import './managePlayer.css';

const ManagePlayer = () => {
    const { teamId } = useParams();
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`https://localhost:7031/api/Player/team/${teamId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setPlayers(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch players. Please try again later.');
                console.error('Error fetching players:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlayers();
    }, [teamId]);

    return (
        <div className="manage-player-container">
            <Sidebar />
            <div className="manage-player-main-content">
                <div className="content-header">
                    <h1>Manage Players</h1>
                    <Link to={`/addplayer/${teamId}`} className="create-player-btn">
                        <FiPlus className="btn-icon" />
                        New Player
                    </Link>
                </div>
                {isLoading ? (
                    <div className="loading-state">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="player-skeleton">
                                <div className="skeleton-image"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <h3>Error Loading Players</h3>
                        <p>{error}</p>
                    </div>
                ) : players.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Players Found Yet!</h3>
                        <p>Get started by adding a new player</p>
                    </div>
                ) : (
                    <div className="player-list">
                        {players.map((player) => (
                            <div key={player.playerId} className="player-item">
                                <div className="player-main-info">
                                    <div className="player-info">
                                        {player.imageUrl && (
                                            <img
                                                src={player.imageUrl}
                                                alt={player.playerName}
                                                className="player-image"
                                            />
                                        )}
                                        <div className="player-text">
                                            <h4>{player.playerName}</h4>
                                            <div className="player-details">
                                                <span className="position-tag">
                                                    {player.position}
                                                </span>
                                                <span className="jersey-no">
                                                    Jersey Number: <b>{player.jerseyNumber}</b>
                                                </span>
                                                <span className="age-info">
                                                    Age: <b>{player.age}</b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="player-actions-container">
                                    <Link
                                        to={`/viewprofile/${player.playerId}`}
                                        className="action-link"
                                    >
                                        <RiUserLine  className="link-icon" />
                                        View Profile
                                    </Link>
                                    <Link
                                        to={`/updateplayer/${player.teamId}/${player.playerId}`}
                                        className="action-link"
                                    >
                                        <FiEdit className="btn-link" />
                                        Edit Player
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

export default ManagePlayer;
