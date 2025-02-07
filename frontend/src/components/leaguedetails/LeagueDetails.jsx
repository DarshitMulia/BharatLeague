import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Spinner, Form, Collapse } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from "../sidebar/Sidebar";
import "./LeagueDetails.css";

const LeagueDetails = () => {
    const { leagueId } = useParams();
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [teamSearchTerm, setTeamSearchTerm] = useState('');
    const [playerSearchTerm, setPlayerSearchTerm] = useState('');

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`https://localhost:7031/api/Team/league/${leagueId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTeams(response.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setTeams([]);
                } else {
                    setError(err.response?.data || err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [leagueId]);

    const fetchPlayers = async (teamId) => {
        try {
            const response = await axios.get(`https://localhost:7031/api/Player/team/${teamId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPlayers(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setPlayers([]);
            } else {
                setError(err.response?.data || err.message);
            }
        }
    };

    const handleTeamClick = async (teamId) => {
        setSelectedTeam(selectedTeam === teamId ? null : teamId);
        if (selectedTeam !== teamId) {
            await fetchPlayers(teamId);
        }
    };

    const filteredTeams = teams.filter(team =>
        team.teamName.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
        team.city.toLowerCase().includes(teamSearchTerm.toLowerCase())
    );

    const filteredPlayers = players.filter(player =>
        player.playerName.toLowerCase().includes(playerSearchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(playerSearchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Container className="loading-container">
                <Spinner animation="border" className="loading-spinner" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="error-container">
                <div className="alert alert-danger">{error}</div>
            </Container>
        );
    }

    return (
        <div className="league-details-wrapper">
            <Sidebar />
            <Container fluid className="league-details-container">
                <h2 className="league-title">League Details</h2>

                <Form.Group className="search-bar mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Search teams by name or city..."
                        value={teamSearchTerm}
                        onChange={(e) => setTeamSearchTerm(e.target.value)}
                        className="search-input rounded-pill"
                    />
                </Form.Group>

                {filteredTeams.length === 0 ? (
                    <div className="alert alert-info">No teams found in this league</div>
                ) : (
                    <div className="team-list">
                        {filteredTeams.map(team => (
                            <Card key={team.teamId} className="team-card shadow-sm mb-3">
                                <Card.Header
                                    onClick={() => handleTeamClick(team.teamId)}
                                    className={`team-header ${selectedTeam === team.teamId ? 'active' : ''}`}
                                >
                                    <Row className="align-items-center">
                                        <Col xs={8} md={4}>
                                            <div className="team-info">
                                                <h5 className="team-name">{team.teamName}</h5>
                                                <div className="team-city">{team.city}</div>
                                            </div>
                                        </Col>
                                        <Col md={4} className="d-none d-md-block">
                                            <div className="coach-info">
                                                <span className="coach-label">Coach:</span>
                                                <span className="coach-name">{team.coachName}</span>
                                            </div>
                                            <div className="founded-year">Est. {team.foundedYear}</div>
                                        </Col>
                                        <Col xs={4} md={4} className="text-end">
                                            <span className="toggle-icon">
                                                {selectedTeam === team.teamId ? '▼' : '▶'}
                                            </span>
                                        </Col>
                                    </Row>
                                </Card.Header>

                                <Collapse in={selectedTeam === team.teamId}>
                                    <Card.Body className="player-section">
                                        <Form.Group className="search-bar mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Search players by name or position..."
                                                value={playerSearchTerm}
                                                onChange={(e) => setPlayerSearchTerm(e.target.value)}
                                                className="search-input rounded-pill"
                                            />
                                        </Form.Group>

                                        {filteredPlayers.length === 0 ? (
                                            <div className="alert alert-info">No players found in this team</div>
                                        ) : (
                                            <ListGroup variant="flush" className="player-list">
                                                {filteredPlayers.map(player => (
                                                    <ListGroup.Item key={player.playerId} className="player-card">
                                                        <Row className="align-items-center">
                                                            <Col xs={12} md={3} className="mb-2 mb-md-0">
                                                                <div className="player-main-info">
                                                                    <span className="jersey-number">#{player.jerseyNumber}</span>
                                                                    <strong className="player-name">{player.playerName}</strong>
                                                                </div>
                                                            </Col>
                                                            <Col xs={6} md={3} className="player-info">
                                                                <span className="info-label">Position:</span>
                                                                <span className="info-value">{player.position}</span>
                                                            </Col>
                                                            <Col xs={6} md={3} className="player-info">
                                                                <span className="info-label">Age:</span>
                                                                <span className="info-value">{player.age}</span>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                    </Card.Body>
                                </Collapse>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default LeagueDetails;
