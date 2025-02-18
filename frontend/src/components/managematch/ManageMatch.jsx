import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "../addmatch/addmatch.css";
import "./managematch.css";

const ManageMatch = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        teamId: "",
        playerId: "",
        eventType: "",
        eventTime: "",
        additionalInfo: ""
    });

    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const matchResponse = await axios.get(
                    `https://localhost:7031/api/Match/${matchId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const team1Promise = axios.get(
                    `https://localhost:7031/api/Team/${matchResponse.data.team1Id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const team2Promise = axios.get(
                    `https://localhost:7031/api/Team/${matchResponse.data.team2Id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const [team1Response, team2Response] = await Promise.all([
                    team1Promise,
                    team2Promise
                ]);

                setTeams([
                    { teamId: team1Response.data.teamId, teamName: team1Response.data.teamName },
                    { teamId: team2Response.data.teamId, teamName: team2Response.data.teamName }
                ]);
            } catch (err) {
                console.error("Error fetching match details:", err);
            }
        };

        if (matchId) fetchMatchDetails();
    }, [matchId]);

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!formData.teamId) return;

            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(
                    `https://localhost:7031/api/Player/team/${formData.teamId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setPlayers(response.data);
            } catch (err) {
                console.error("Error fetching players:", err);
            }
        };

        fetchPlayers();
    }, [formData.teamId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.teamId) {
            newErrors.teamId = "Please select a team";
        } else if (parseInt(formData.teamId, 10) <= 0) {
            newErrors.teamId = "TeamId must be greater than 0";
        }

        if (!formData.playerId) {
            newErrors.playerId = "Please select a player";
        } else if (parseInt(formData.playerId, 10) <= 0) {
            newErrors.playerId = "PlayerId must be greater than 0";
        }

        if (!formData.eventType) {
            newErrors.eventType = "Please select an event type";
        } else {
            if (formData.eventType.length > 50) {
                newErrors.eventType = "EventType must not exceed 50 characters";
            }
            const allowedTypes = ["Goal", "Assist", "Foul", "Yellow Card", "Red Card"];
            const isValidType = allowedTypes.some(
                (type) => type.toLowerCase() === formData.eventType.toLowerCase()
            );
            if (!isValidType) {
                newErrors.eventType =
                    "EventType must be one of the following: Goal, Assist, Foul, Yellow Card, Red Card";
            }
        }

        if (formData.eventTime === "") {
            newErrors.eventTime = "Event time is required";
        } else {
            const eventTime = parseInt(formData.eventTime, 10);
            if (isNaN(eventTime)) {
                newErrors.eventTime = "Event time must be a valid number";
            } else if (eventTime < 0 || eventTime > 150) {
                newErrors.eventTime = "EventTime must be between 0 and 150 minutes";
            }
        }

        if (formData.additionalInfo && formData.additionalInfo.length > 250) {
            newErrors.additionalInfo = "Additional Info must not exceed 250 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("authToken");
            const matchEvent = {
                matchId: parseInt(matchId, 10),
                teamId: parseInt(formData.teamId, 10),
                playerId: formData.playerId ? parseInt(formData.playerId, 10) : null,
                eventType: formData.eventType,
                eventTime: parseInt(formData.eventTime, 10),
                additionalInfo: formData.additionalInfo || null
            };

            await axios.post(
                "https://localhost:7031/api/MatchEvents/addevent",
                matchEvent,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate(-1);
        } catch (err) {
            console.error("Error adding match event:", err);
            alert("An error occurred while adding the match event");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkAsCompleted = async () => {
        setIsCompleting(true);
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(
                `https://localhost:7031/api/PlayerStatistics/matchcomplete/${matchId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Match marked as completed successfully!");
            navigate(-1);
        } catch (err) {
            console.error("Error marking match as completed:", err);
            alert("An error occurred while marking the match as completed");
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <div className="add-match-container">
            <Sidebar />
            <div className="add-match-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Add Match Event</h1>
                    <form onSubmit={handleSubmit} className="match-form">
                        <div className="form-group">
                            <label className="form-label">Select Team</label>
                            <div className="team-selection">
                                {teams.map((team) => (
                                    <label key={team.teamId} className="radio-option">
                                        <input
                                            type="radio"
                                            name="teamId"
                                            value={team.teamId}
                                            checked={formData.teamId === team.teamId.toString()}
                                            onChange={handleInputChange}
                                        />
                                        {team.teamName}
                                    </label>
                                ))}
                            </div>
                            {errors.teamId && <p className="error-text">{errors.teamId}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Player</label>
                            <select
                                className="form-input"
                                name="playerId"
                                value={formData.playerId}
                                onChange={handleInputChange}
                                disabled={!formData.teamId}
                            >
                                <option value="">Select Player</option>
                                {players.map((player) => (
                                    <option key={player.playerId} value={player.playerId}>
                                        {player.playerName}
                                    </option>
                                ))}
                            </select>
                            {errors.playerId && <p className="error-text">{errors.playerId}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Event Type</label>
                            <select
                                className="form-input"
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Event Type</option>
                                <option value="Goal">Goal</option>
                                <option value="Assist">Assist</option>
                                <option value="Yellow Card">Yellow Card</option>
                                <option value="Red Card">Red Card</option>
                                <option value="Foul">Foul</option>
                            </select>
                            {errors.eventType && <p className="error-text">{errors.eventType}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Event Time (minutes)</label>
                            <input
                                className="form-input"
                                type="number"
                                name="eventTime"
                                value={formData.eventTime}
                                onChange={handleInputChange}
                                min="0"
                                max="150"
                                placeholder="Enter minutes"
                            />
                            {errors.eventTime && <p className="error-text">{errors.eventTime}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Info (Optional)</label>
                            <input
                                className="form-input"
                                type="text"
                                name="additionalInfo"
                                placeholder="Enter additional information"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                            />
                            {errors.additionalInfo && <p className="error-text">{errors.additionalInfo}</p>}
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="back-button"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Add Match Event"}
                            </button>
                            <button
                                type="button"
                                className="header-button"
                                style={{ width: "50%" }}
                                onClick={handleMarkAsCompleted}
                                disabled={isCompleting}
                            >
                                {isCompleting ? "Completing..." : "Mark Match As Completed"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageMatch;
