import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import '../ongoingmatches/ongoingmatches.css';
import "font-awesome/css/font-awesome.min.css";

const OngoingMatchesByLeague = () => {
    const { leagueId } = useParams();
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

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
                // Fetch the ongoing matches for the league
                const matchesResponse = await axios.get(
                    `https://localhost:7031/api/match/ongoingmatches/${leagueId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMatches(matchesResponse.data);

                // Fetch the teams in the league
                const teamsResponse = await axios.get(
                    `https://localhost:7031/api/team/league/${leagueId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTeams(teamsResponse.data);

                // Fetch the league details
                const leagueResponse = await axios.get(
                    `https://localhost:7031/api/league/${leagueId}`,
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
        return <div className="loading">Loading ongoing matches...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="matches-container-for-all">
            <Sidebar />
            <header className="matches-header">
                <h1>{league ? league.leagueName : `Ongoing Matches`} (Ongoing Matches)</h1>
            </header>

            <div className="content-wrapper">
                {matches.length === 0 ? (
                    <div className="empty-state">No ongoing matches found for this league.</div>
                ) : (
                    <div className="matches-grid">
                        {matches.map((match) => (
                            <div key={match.matchId} className="match-card">
                                <button onClick={() => navigate(`addmatchevents/${match.matchId}`)} className="header-button">
                                    Manage Match
                                    <i className="fa fa-cogs" style={{ color: "white", marginLeft: "10px" }}></i>
                                </button>
                                <div style={{ "marginTop": "10px", "border-bottom": "1px solid #e2e8f0" }}></div>
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
                                    <div className="button-group">
                                        <button
                                            type="button"
                                            className="back-button"
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </button>
                                        <button onClick={() => navigate(`/viewmatchdetails/${leagueId}/${match.matchId}`)} className="submit-button">
                                            View Match Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OngoingMatchesByLeague;
