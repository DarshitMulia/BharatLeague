import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import "./ongoingmatches.css";
import { useNavigate } from "react-router-dom";

const OngoingMatches = () => {
  const [groupedMatches, setGroupedMatches] = useState({});
  const [leagueDetails, setLeagueDetails] = useState({});
  const [teamsByLeague, setTeamsByLeague] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const getTeamName = (leagueId, teamId) => {
    const teams = teamsByLeague[leagueId] || [];
    const team = teams.find((t) => t.teamId === teamId);
    return team ? team.teamName : `ID: ${teamId}`;
  };

  const getTeamImage = (leagueId, teamId) => {
    const teams = teamsByLeague[leagueId] || [];
    const team = teams.find((t) => t.teamId === teamId);
    return team && team.imageUrl ? team.imageUrl : "https://via.placeholder.com/50";
  };

  const fetchMatches = async (url, params = {}) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      const matchesData = response.data;
      const grouped = matchesData.reduce((acc, match) => {
        if (!acc[match.leagueId]) {
          acc[match.leagueId] = [];
        }
        acc[match.leagueId].push(match);
        return acc;
      }, {});
      setGroupedMatches(grouped);

      const leagueIds = Object.keys(grouped);
      const leaguePromises = leagueIds.map((leagueId) =>
        axios.get(`https://localhost:7031/api/League/${leagueId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const teamsPromises = leagueIds.map((leagueId) =>
        axios.get(`https://localhost:7031/api/Team/league/${leagueId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const leaguesResponses = await Promise.all(leaguePromises);
      const teamsResponses = await Promise.all(teamsPromises);

      const leaguesData = {};
      leagueIds.forEach((leagueId, index) => {
        leaguesData[leagueId] = leaguesResponses[index].data;
      });
      setLeagueDetails(leaguesData);

      const teamsData = {};
      leagueIds.forEach((leagueId, index) => {
        teamsData[leagueId] = teamsResponses[index].data;
      });
      setTeamsByLeague(teamsData);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError(err.response?.data || "An error occurred while fetching matches.");
    }
  };

  useEffect(() => {
    const fetchOngoingMatches = async () => {
      setIsFetching(true);
      await fetchMatches("https://localhost:7031/api/Match/ongoingmatches");
      setIsFetching(false);
    };
    fetchOngoingMatches();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      if (searchTerm.trim() !== "") {
        await fetchMatches("https://localhost:7031/api/Match/searchmatches", {
          teamName: searchTerm,
          venue: searchTerm,
        });
      } else {
        await fetchMatches("https://localhost:7031/api/Match/ongoingmatches");
      }
      setIsFetching(false);
    };

    const timeoutId = setTimeout(fetchData, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, token]);

  if (isFetching && Object.keys(groupedMatches).length === 0) {
    return <div className="loading">Loading matches...</div>;
  }

  return (
    <div className="ongoing-matches-container">
      <Sidebar />
      <header className="matches-header">
        <h1>Live Matches</h1>
      </header>

      <div className="search-filter-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by team name or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isFetching && (
          <div className="search-indicator">
            Searching...
          </div>
        )}
      </div>

      {error && <div className="error">Error: {error}</div>}

      <div className="content-wrapper">
        {Object.keys(groupedMatches).length === 0 ? (
          <div className="empty-state">No matches found</div>
        ) : (
          Object.keys(groupedMatches).map((leagueId) => {
            const league = leagueDetails[leagueId];
            return (
              <div key={leagueId} className="league-section">
                <div className="league-badge" style={{ color: "#E85D04", paddingTop: "20px" }}>
                  <b>
                    <h3>{league ? league.leagueName : leagueId}</h3>
                  </b>
                </div>
                <div className="matches-grid">
                  {groupedMatches[leagueId]
                    .filter((match) => match.status === "Ongoing")
                    .map((match) => (
                      <div key={match.matchId} className="match-card">
                        <div className="live-ribbon">LIVE</div>
                        <div className="teams-container">
                          <div className="team">
                            <div className="team-logo">
                              <img
                                src={getTeamImage(leagueId, match.team1Id)}
                                alt={getTeamName(leagueId, match.team1Id)}
                                className="team-logo-img"
                              />
                            </div>
                            <span>{getTeamName(leagueId, match.team1Id)}</span>
                          </div>
                          <div className="vs-container">
                            <span className="vs-swords">⚔️</span>
                          </div>
                          <div className="team">
                            <div className="team-logo">
                              <img
                                src={getTeamImage(leagueId, match.team2Id)}
                                alt={getTeamName(leagueId, match.team2Id)}
                                className="team-logo-img"
                              />
                            </div>
                            <span>{getTeamName(leagueId, match.team2Id)}</span>
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
                          <button
                            onClick={() =>
                              navigate(`/viewmatchdetails/${match.leagueId}/${match.matchId}`)
                            }
                            className="details-button"
                          >
                            View Match Details →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OngoingMatches;
