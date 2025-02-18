import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "../addteam/addteam.css";
import "../createleague/createleague.css";
import "../updateleague/updateleague.css";

const UpdateMatch = () => {
    const { leagueId, matchId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        leagueId: leagueId || "",
        team1Id: "",
        team2Id: "",
        matchDate: "",
        startTime: "",
        venue: "",
        status: "Scheduled",
    });
    const [teams, setTeams] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem("authToken");

    const formatDateForInput = (dateString) => (dateString ? dateString.split("T")[0] : "");
    const formatTimeForInput = (timeString) => (timeString ? timeString.slice(0, 5) : "");

    useEffect(() => {
        axios
            .get(`https://localhost:7031/api/Match/${matchId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const data = response.data;
                setFormData({
                    leagueId: data.leagueId,
                    team1Id: data.team1Id,
                    team2Id: data.team2Id,
                    matchDate: formatDateForInput(data.matchDate),
                    startTime: formatTimeForInput(data.startTime),
                    venue: data.venue,
                    status: data.status || "Scheduled",
                });
            });
    }, [matchId, token]);

    useEffect(() => {
        axios
            .get(`https://localhost:7031/api/Team/league/${leagueId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setTeams(response.data));
    }, [leagueId, token]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.team1Id) newErrors.team1Id = "Please select Team 1.";
        if (!formData.team2Id) newErrors.team2Id = "Please select Team 2.";
        if (formData.team1Id && formData.team2Id && formData.team1Id === formData.team2Id)
            newErrors.team2Id = "Team 1 and Team 2 must be different.";
        if (!formData.matchDate) {
            newErrors.matchDate = "Match Date is required.";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const mDate = new Date(formData.matchDate);
            if (mDate < today) newErrors.matchDate = "Match Date cannot be in the past.";
        }
        if (!formData.startTime) newErrors.startTime = "Start Time is required.";
        if (!formData.venue) {
            newErrors.venue = "Venue is required.";
        } else if (formData.venue.length > 150) {
            newErrors.venue = "Venue must not exceed 150 characters.";
        }
        if (!formData.status) {
            newErrors.status = "Status is required.";
        } else {
            const allowedStatuses = ["Scheduled", "Ongoing", "Completed"];
            if (!allowedStatuses.includes(formData.status)) {
                newErrors.status = "Status must be one of the following: Scheduled, Ongoing, Completed.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }
        const updatedMatch = {
            matchId: parseInt(matchId, 10),
            leagueId: parseInt(leagueId, 10),
            team1Id: parseInt(formData.team1Id, 10),
            team2Id: parseInt(formData.team2Id, 10),
            matchDate: formData.matchDate,
            startTime: formData.startTime,
            venue: formData.venue,
            status: formData.status,
        };
        axios
            .put(`https://localhost:7031/api/Match/updatematch/${matchId}`, updatedMatch, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => navigate(-1));
    };

    return (
        <div className="add-team-container">
            <Sidebar />
            <div className="add-team-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Update Match</h1>
                    <form onSubmit={handleSubmit} className="team-form">
                        <div className="form-group">
                            <label className="form-label">Team 1</label>
                            <select
                                className="form-input"
                                name="team1Id"
                                value={formData.team1Id}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Team 1</option>
                                {teams.map((team) => (
                                    <option key={team.teamId} value={team.teamId}>
                                        {team.teamName}
                                    </option>
                                ))}
                            </select>
                            {errors.team1Id && <p className="error-text">{errors.team1Id}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Team 2</label>
                            <select
                                className="form-input"
                                name="team2Id"
                                value={formData.team2Id}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Team 2</option>
                                {teams.map((team) => (
                                    <option key={team.teamId} value={team.teamId}>
                                        {team.teamName}
                                    </option>
                                ))}
                            </select>
                            {errors.team2Id && <p className="error-text">{errors.team2Id}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Match Date</label>
                            <input
                                className="form-input"
                                type="date"
                                name="matchDate"
                                value={formData.matchDate}
                                onChange={handleInputChange}
                            />
                            {errors.matchDate && <p className="error-text">{errors.matchDate}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Start Time</label>
                            <input
                                className="form-input"
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                            />
                            {errors.startTime && <p className="error-text">{errors.startTime}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Venue</label>
                            <input
                                className="form-input"
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleInputChange}
                            />
                            {errors.venue && <p className="error-text">{errors.venue}</p>}
                        </div>
                        <div className="button-group">
                            <button type="button" className="back-button" onClick={() => navigate(-1)}>
                                Back
                            </button>
                            <button type="submit" className="submit-button" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Update Match"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateMatch;
