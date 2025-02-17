import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import './leaguestandings.css';

const LeagueStandings = () => {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeagueId, setSelectedLeagueId] = useState("");
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await fetch("https://localhost:7031/api/League/leagues", {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch leagues.");
                }
                const data = await response.json();
                setLeagues(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchLeagues();
    }, [token]);

    useEffect(() => {
        const fetchStandings = async () => {
            if (!selectedLeagueId) return;

            setLoading(true);
            setError("");
            try {
                const response = await fetch(`https://localhost:7031/api/leagueStandings/${selectedLeagueId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch league standings.");
                }
                const data = await response.json();
                setStandings(data);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };

        fetchStandings();
    }, [selectedLeagueId, token]);

    const handleLeagueChange = (e) => {
        setSelectedLeagueId(e.target.value);
        setStandings([]);
    };

    const sortedStandings = [...standings].sort((a, b) => b.points - a.points);

    return (
        <div className="league-standings-container">
            <Sidebar />
            <div className="standings-content">
                <h1 className="standings-title">League Standings</h1>

                {error && <p className="error-message">{error}</p>}

                <div className="league-select-container">
                    <label htmlFor="league-select" className="select-label">
                        Select a League:
                    </label>
                    <select
                        id="league-select"
                        value={selectedLeagueId}
                        onChange={handleLeagueChange}
                        className="league-select"
                    >
                        <option value="">Select League</option>
                        {leagues.map((league) => (
                            <option key={league.leagueId} value={league.leagueId}>
                                {league.leagueName}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="loading-spinner"></div>
                ) : sortedStandings && sortedStandings.length > 0 ? (
                    <div className="table-container">
                        <table className="standings-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Team Name</th>
                                    <th>MP</th>
                                    <th>W</th>
                                    <th>L</th>
                                    <th>D</th>
                                    <th>GF</th>
                                    <th>GA</th>
                                    <th>GD</th>
                                    <th>PTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedStandings.map((standing, index) => (
                                    <tr key={standing.standingId}>
                                        <td>{index + 1}</td>
                                        <td className="team-name-cell">
                                            {standing.teamName || standing.teamId}
                                        </td>
                                        <td>{standing.matchesPlayed}</td>
                                        <td>{standing.wins}</td>
                                        <td>{standing.losses}</td>
                                        <td>{standing.draws}</td>
                                        <td>{standing.goalsScored}</td>
                                        <td>{standing.goalsConceded}</td>
                                        <td>{standing.goalsDifference}</td>
                                        <td className="points-cell">{standing.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : selectedLeagueId ? (
                    <p className="no-standings">No standings found for this league.</p>
                ) : (
                    <p className="select-prompt">Please select a league to view its standings.</p>
                )}
            </div>
        </div>
    );
};

export default LeagueStandings;
