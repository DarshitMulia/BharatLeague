import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import '../ongoingmatches/ongoingmatches.css';

const GetMatchesByLeague = () => {
    const { leagueId } = useParams();
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    // Utility functions to get team name and image based on teamId.
    const getTeamName = (teamId) => {
        const team = teams.find((t) => t.teamId === teamId);
        return team ? team.teamName : `ID: ${teamId}`;
    };

    const getTeamImage = (teamId) => {
        const team = teams.find((t) => t.teamId === teamId);
        return team && team.imageUrl ? team.imageUrl : "https://via.placeholder.com/50";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all matches in the league.
                const matchesResponse = await axios.get(
                    `https://localhost:7031/api/Match/league/${leagueId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMatches(matchesResponse.data);

                // Fetch teams for the league.
                const teamsResponse = await axios.get(
                    `https://localhost:7031/api/Team/league/${leagueId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTeams(teamsResponse.data);

                // Fetch league details.
                const leagueResponse = await axios.get(
                    `https://localhost:7031/api/League/${leagueId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLeague(leagueResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.response?.data || "An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [leagueId, token]);

    if (loading) {
        return <div className="loading">Loading league matches...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    // Filter matches by status.
    const scheduledMatches = matches.filter((match) => match.status === "Scheduled");
    const ongoingMatches = matches.filter((match) => match.status === "Ongoing");
    const completedMatches = matches.filter((match) => match.status === "Completed");

    // Render a single match card.
    const renderMatchCard = (match) => (
        <div key={match.matchId} className="match-card">
            <div className="teams-container">
                <div className="team">
                    <div className="team-logo">
                        <img
                            src={getTeamImage(match.team1Id)}
                            alt={getTeamName(match.team1Id)}
                            className="team-logo-img"
                        />
                    </div>
                    <span>{getTeamName(match.team1Id)}</span>
                </div>

                <div className="vs-container">
                    <span className="vs-swords">⚔️</span>
                </div>

                <div className="team">
                    <div className="team-logo">
                        <img
                            src={getTeamImage(match.team2Id)}
                            alt={getTeamName(match.team2Id)}
                            className="team-logo-img"
                        />
                    </div>
                    <span>{getTeamName(match.team2Id)}</span>
                </div>
            </div>

            <div className="match-info">
                <div className="info-row">
                    <span className="info-label">📅 Date</span>
                    <span className="info-value">
                        {new Date(match.matchDate).toLocaleDateString()}
                    </span>
                </div>

                <div className="info-row">
                    <span className="info-label">⏰ Time</span>
                    <span className="info-value">
                        {match.startTime || "TBD"}
                    </span>
                </div>

                <div className="info-row">
                    <span className="info-label">📍 Venue</span>
                    <span className="info-value">{match.venue || "To be determined"}</span>
                </div>

                <button onClick={() => navigate(`/viewmatchdetails/${match.leagueId}/${match.matchId}`)} className="details-button">
                    View Match Details →
                </button>
            </div>
        </div>
    );

    return (
        <div className="matches-container-for-all">
            <Sidebar />
            <header className="matches-header">
                <h1>{league ? league.leagueName : "League Matches"}</h1>
            </header>

            <div className="content-wrapper">
                {/* Scheduled Matches */}
                <section className="status-section">
                    <h2>Scheduled Matches</h2>
                    {scheduledMatches.length === 0 ? (
                        <div className="empty-state">No scheduled matches found in this league.</div>
                    ) : (
                        <div className="matches-grid">
                            {scheduledMatches.map(renderMatchCard)}
                        </div>
                    )}
                </section>

                {/* Ongoing Matches */}
                <section className="status-section">
                    <h2>Ongoing Matches</h2>
                    {ongoingMatches.length === 0 ? (
                        <div className="empty-state">No ongoing matches found in this league.</div>
                    ) : (
                        <div className="matches-grid">
                            {ongoingMatches.map(renderMatchCard)}
                        </div>
                    )}
                </section>

                {/* Completed Matches */}
                <section className="status-section">
                    <h2>Completed Matches</h2>
                    {completedMatches.length === 0 ? (
                        <div className="empty-state">No completed matches found in this league.</div>
                    ) : (
                        <div className="matches-grid">
                            {completedMatches.map(renderMatchCard)}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default GetMatchesByLeague;
