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
                    <div className="profile-image">
                        <img src={profile.playerImage} alt={profile.playerName} />
                    </div>
                    <div className="profile-details">
                        <h1>{profile.playerName}</h1>
                        <p><strong>Age:</strong> {profile.age}</p>
                        <p><strong>Jersey Number:</strong> {profile.jerseyNumber}</p>
                        <p><strong>Position:</strong> {profile.position}</p>
                    </div>
                </div>

                <div className="team-league-info">
                    <div className="player-team-info">
                        <img src={profile.teamImage} alt={profile.teamName} />
                        <h2>{profile.teamName}</h2>
                    </div>
                    <div className="player-league-info">
                        <img src={profile.leagueImage} alt={profile.leagueName} />
                        <h2>{profile.leagueName}</h2>
                    </div>
                </div>

                <div className="statistics-section">
                    <h2>Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat">
                            <h3>{profile.matchesPlayed}</h3>
                            <p>Matches Played</p>
                        </div>
                        <div className="stat">
                            <h3>{profile.goals}</h3>
                            <p>Goals</p>
                        </div>
                        <div className="stat">
                            <h3>{profile.assists}</h3>
                            <p>Assists</p>
                        </div>
                        <div className="stat">
                            <h3>{profile.yellowCards}</h3>
                            <p>Yellow Cards</p>
                        </div>
                        <div className="stat">
                            <h3>{profile.redCards}</h3>
                            <p>Red Cards</p>
                        </div>
                        <div className="stat">
                            <h3>{profile.fouls}</h3>
                            <p>Fouls</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPlayerProfile;
