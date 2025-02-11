import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiArrowRight } from 'react-icons/fi';
import './viewmatchdetails.css';
import Sidebar from '../sidebar/Sidebar';

const ViewMatchDetails = () => {
  const { matchId } = useParams();
  const [matchEvents, setMatchEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get(
          `https://localhost:7031/api/MatchEvents/${matchId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const events = eventsResponse.data;
        setMatchEvents(events);

        const teamsResponse = await axios.get(
          `https://localhost:7031/api/Team/match/${matchId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const matchTeams = teamsResponse.data;
        setTeams(matchTeams);

        const teamIds = matchTeams.map((team) => team.teamId);
        const playersPromises = teamIds.map((teamId) =>
          axios.get(`https://localhost:7031/api/Player/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        const playersResponses = await Promise.all(playersPromises);
        setPlayers(playersResponses.flatMap((res) => res.data));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId, token]);

  const calculateScore = (teamId) => {
    return matchEvents.filter(
      (event) => event.teamId === teamId && event.eventType === 'Goal'
    ).length;
  };

  const goals = matchEvents
    .filter((event) => event.eventType === 'Goal')
    .sort((a, b) => b.eventTime - a.eventTime);

  const otherEvents = matchEvents
    .filter((event) => event.eventType !== 'Goal')
    .sort((a, b) => b.eventTime - a.eventTime);

  const participatingTeams = teams;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="match-dashboard">
      <Sidebar />

      {/* Score Header with Team Names */}
      {participatingTeams.length === 2 ? (
        <div className="score-header">
          <div className="team-info left">
            <img
              src={participatingTeams[0].imageUrl || '/default-team-logo.png'}
              alt={participatingTeams[0].teamName}
              className="team-logo"
            />
            <h2 className="team-name-heading">
              {participatingTeams[0].teamName}
            </h2>
          </div>
          <div className="scores-container">
            <span className="score">
              {calculateScore(participatingTeams[0].teamId)}
            </span>
            <span className="vs"> - </span>
            <span className="score">
              {calculateScore(participatingTeams[1].teamId)}
            </span>
          </div>
          <div className="team-info right">
            <img
              src={participatingTeams[1].imageUrl || '/default-team-logo.png'}
              alt={participatingTeams[1].teamName}
              className="team-logo"
            />
            <h2 className="team-name-heading">
              {participatingTeams[1].teamName}
            </h2>
          </div>
        </div>
      ) : (
        // Fallback layout if there are not exactly two teams
        participatingTeams.map((team) => (
          <div key={team.teamId} className="team-container">
            <img
              src={team.imageUrl || '/default-team-logo.png'}
              alt={team.teamName}
              className="team-logo"
            />
            <h2 className="team-name-heading">{team.teamName}</h2>
            <div className="team-score">{calculateScore(team.teamId)}</div>
          </div>
        ))
      )}

      {/* Match Timeline */}
      <div className="match-timeline">
        <h2 className="section-heading">Match Events Timeline</h2>
        <div className="timeline-container">
          {[...goals, ...otherEvents]
            .sort((a, b) => b.eventTime - a.eventTime)
            .map((event, index) => (
              <div
                key={index}
                className={`timeline-event ${event.eventType.toLowerCase()}`}
              >
                <div className="event-time">{event.eventTime}'</div>
                <div className="event-content">
                  <span className="event-type">{event.eventType}</span>
                  {event.eventType === 'Goal' && (
                    <span className="scorer-name">
                      {players.find(
                        (p) => p.playerId === event.playerId
                      )?.playerName || 'Unknown'}
                    </span>
                  )}
                  {event.additionalInfo && (
                    <div className="event-detail">{event.additionalInfo}</div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Team Rosters */}
      <div className="team-rosters">
        {participatingTeams.map((team) => (
          <div key={team.teamId} className="roster-container">
            <h2 className="roster-title">{team.teamName} Squad</h2>
            <div className="player-grid">
              {players
                .filter((p) => p.teamId === team.teamId)
                .map((player) => (
                  <div key={player.playerId} className="player-card">
                    <div className="player-header">
                      <span className="jersey-number">
                        #{player.jerseyNumber}
                      </span>
                      <span className="player-position">
                        {player.position}
                      </span>
                    </div>
                    <h3 className="player-name">{player.playerName}</h3>
                    <Link
                      to={`viewplayerprofile/${player.playerId}`}
                      className="view-profile-link"
                    >
                      View Profile
                      <FiArrowRight className="link-icon" />
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMatchDetails;
