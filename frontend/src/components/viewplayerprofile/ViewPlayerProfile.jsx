import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../sidebar/Sidebar";
import { useParams } from 'react-router-dom';
import './viewplayerprofile.css';

const ViewPlayerProfile = () => {
    const [profile, setProfile] = useState(null);
    const { playerId } = useParams();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchPlayerProfile();
    }, []);

    const fetchPlayerProfile = async () => {
        try {
            const { data } = await axios.get(`https://localhost:7031/api/PlayerStatistics/${playerId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(data);
        } catch (error) {
            console.error('Error fetching player profile:', error);
        }
    };

    if (!profile) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="player-profile-container">
            <Sidebar />
            <div className="content">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <div className="profile-image">
                            <img src={profile.playerImage} alt={profile.playerName} />
                        </div>
                        <div className="jersey-number-player-profile">{profile.jerseyNumber}</div>
                    </div>

                    <div className="profile-details">
                        <h1>{profile.playerName}</h1>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Age</span>
                                <span className="detail-value">{profile.age}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Position</span>
                                <span className="detail-value">{profile.position}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="affiliation-section">
                    <div className="affiliation-card">
                        <div className="affiliation-logo">
                            <img src={profile.teamImage} alt={profile.teamName} />
                        </div>
                        <div className="affiliation-info">
                            <span className="affiliation-label">Team</span>
                            <h3>{profile.teamName}</h3>
                        </div>
                    </div>

                    <div className="affiliation-card">
                        <div className="affiliation-logo">
                            <img src={profile.leagueImage} alt={profile.leagueName} />
                        </div>
                        <div className="affiliation-info">
                            <span className="affiliation-label">League</span>
                            <h3>{profile.leagueName}</h3>
                        </div>
                    </div>
                </div>

                <div className="statistics-section">
                    <div className="section-header">
                        <h2>Season Statistics</h2>
                        <div className="divider"></div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card accent">
                            <div className="stat-value">{profile.matchesPlayed}</div>
                            <div className="stat-label">Matches</div>
                        </div>
                        <div className="stat-card accent">
                            <div className="stat-value">{profile.goals}</div>
                            <div className="stat-label">Goals</div>
                        </div>
                        <div className="stat-card accent">
                            <div className="stat-value">{profile.assists}</div>
                            <div className="stat-label">Assists</div>
                        </div>
                        <div className="stat-card accent">
                            <div className="stat-value">{profile.yellowCards}</div>
                            <div className="stat-label">Yellow Cards</div>
                        </div>
                        <div className="stat-card accent">
                            <div className="stat-value">{profile.redCards}</div>
                            <div className="stat-label">Red Cards</div>
                        </div>
                        <div className="stat-card accent">
                            <div className="stat-value">{profile.fouls}</div>
                            <div className="stat-label">Fouls</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPlayerProfile;
