import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "./addmatch.css";

const AddMatch = () => {
    const { leagueId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        team1Id: "",
        team2Id: "",
        matchDate: "",
        startTime: "",
        venue: "",
    });

    const [teams, setTeams] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!leagueId) {
            console.error("League ID not found in the URL.");
            return;
        }

        const fetchTeams = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(
                    `https://localhost:7031/api/Team/league/${leagueId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTeams(response.data);
            } catch (err) {
                console.error("Error fetching teams:", err);
            }
        };

        fetchTeams();
    }, [leagueId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.team1Id) newErrors.team1Id = "Please select Team 1.";
        if (!formData.team2Id) newErrors.team2Id = "Please select Team 2.";
        if (formData.team1Id && formData.team2Id && formData.team1Id === formData.team2Id) {
            newErrors.team2Id = "Team 1 and Team 2 cannot be the same.";
        }
        if (!formData.matchDate) newErrors.matchDate = "Match Date is required.";
        if (!formData.startTime) newErrors.startTime = "Start Time is required.";
        if (!formData.venue) newErrors.venue = "Venue is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatTimeForAPI = (timeString) => {
        if (!timeString) return "";
        return `${timeString}:00`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("authToken");

            const matchData = {
                leagueId: parseInt(leagueId, 10),
                team1Id: parseInt(formData.team1Id, 10),
                team2Id: parseInt(formData.team2Id, 10),
                matchDate: formData.matchDate,
                startTime: formatTimeForAPI(formData.startTime),
                venue: formData.venue,
                status: "Scheduled",
            };

            console.log("Sending Match Data:", matchData);

            const response = await axios.post(
                "https://localhost:7031/api/Match/addmatch",
                matchData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Match added successfully!");
            console.log(response.data);
            navigate("/");
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while adding the match.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-match-container">
            <Sidebar />
            <div className="add-match-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Add New Match</h1>
                    <form onSubmit={handleSubmit} className="match-form">
                        <div className="form-group">
                            <label className="form-label">Team 1</label>
                            <select
                                className="form-input"
                                name="team1Id"
                                value={formData.team1Id}
                                onChange={handleInputChange}
                                required
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
                                required
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
                                required
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
                                required
                            />
                            {errors.startTime && <p className="error-text">{errors.startTime}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Venue</label>
                            <input
                                className="form-input"
                                type="text"
                                name="venue"
                                placeholder="Enter Venue"
                                value={formData.venue}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.venue && <p className="error-text">{errors.venue}</p>}
                        </div>

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Add Match"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMatch;
