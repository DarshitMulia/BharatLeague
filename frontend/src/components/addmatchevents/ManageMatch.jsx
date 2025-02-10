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
    const [errors, setErrors] = useState({});

    // Fetch match details and then team details for team names
    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const token = localStorage.getItem("authToken");
                // Get match details
                const matchResponse = await axios.get(
                    `https://localhost:7031/api/Match/${matchId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Match Details:", matchResponse.data);

                // Now fetch the team details for team1Id and team2Id
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

    // Fetch players when a team is selected
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
        if (!formData.teamId) newErrors.teamId = "Please select a team";
        if (!formData.playerId) newErrors.playerId = "Please select a player";
        if (!formData.eventType) newErrors.eventType = "Please select an event type";
        if (!formData.eventTime) newErrors.eventTime = "Event time is required";
        
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
                matchId: parseInt(matchId),
                teamId: parseInt(formData.teamId),
                playerId: formData.playerId ? parseInt(formData.playerId) : null,
                eventType: formData.eventType,
                eventTime: parseInt(formData.eventTime),
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

            alert("Match event added successfully!");
            navigate(-1); // Go back to previous page
        } catch (err) {
            console.error("Error adding match event:", err);
            alert("An error occurred while adding the match event");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-match-container">
            <Sidebar />
            <div className="add-match-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Add Match Event</h1>
                    <form onSubmit={handleSubmit} className="match-form">
                        {/* Team Selection */}
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

                        {/* Player Selection */}
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
                        </div>

                        {/* Event Type Selection */}
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

                        {/* Event Time */}
                        <div className="form-group">
                            <label className="form-label">Event Time (minutes)</label>
                            <input
                                className="form-input"
                                type="number"
                                name="eventTime"
                                value={formData.eventTime}
                                onChange={handleInputChange}
                                min="0"
                                max="120"
                                placeholder="Enter minutes"
                            />
                            {errors.eventTime && <p className="error-text">{errors.eventTime}</p>}
                        </div>

                        {/* Additional Info */}
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
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Add Event"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageMatch;
