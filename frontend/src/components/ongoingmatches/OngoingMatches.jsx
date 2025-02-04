import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import './ongoingmatches.css';

const OngoingMatches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.teamId === teamId);
    return team ? team.teamName : `ID: ${teamId}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchesResponse = await axios.get(
          "https://localhost:7031/api/Match/ongoingmatches",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const matchesData = matchesResponse.data;
        setMatches(matchesData);

        if (matchesData.length > 0) {
          const leagueId = matchesData[0].leagueId;

          const teamsResponse = await axios.get(
            `https://localhost:7031/api/Team/league/${leagueId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTeams(teamsResponse.data);

          const leagueResponse = await axios.get(
            `https://localhost:7031/api/League/${leagueId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setLeague(leagueResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading ongoing matches...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ongoing-matches-container">
      <Sidebar />
      <header className="matches-header">
        <h1>Live Matches</h1>
      </header>

      <div className="content-wrapper">
        {matches.length === 0 ? (
          <div className="empty-state">No live matches currently ongoing</div>
        ) : (
          <div className="matches-grid">
            {matches.map((match) => (
              <div key={match.matchId} className="match-card">
                <div className="live-ribbon">LIVE</div>
                {/* {league && (
                  <div className="league-badge">
                    {league.leagueName || league.leagueId}
                  </div>
                )} */}

                <div className="teams-container">
                  <div className="team">
                    <div className="team-logo"></div>
                    <span className="team-name">{getTeamName(match.team1Id)}</span>
                  </div>

                  <div className="vs-container">
                    <span className="vs-swords">⚔️</span>
                  </div>

                  <div className="team">
                    <div className="team-logo"></div>
                    <span className="team-name">{getTeamName(match.team2Id)}</span>
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
                    <span className="info-value">{match.startTime}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">📍 Venue</span>
                    <span className="info-value">{match.venue}</span>
                  </div>

                  <button className="details-button">
                    View Match Details →
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

export default OngoingMatches;
