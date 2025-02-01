import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import '../addteam/addteam.css';
import "../createleague/createleague.css";
import "../updateleague/updateleague.css";

const UpdateMatch = () => {
    // Extract leagueId and matchId from the URL parameters
    const { leagueId, matchId } = useParams();
    const navigate = useNavigate();

    // Set up formData state with initial values; leagueId is obtained from useParams
    const [formData, setFormData] = useState({
        leagueId: leagueId || '',
        team1Id: '',
        team2Id: '',
        matchDate: '',
        startTime: '',
        venue: '',
        status: 'Scheduled', // default status value
    });

    const [teams, setTeams] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        team1Id: '',
        team2Id: '',
        matchDate: '',
        startTime: '',
        venue: '',
    });
    const [errorMessage, setErrorMessage] = useState("");

    // Helper functions to format ISO datetime strings for input fields
    const formatDateForInput = (dateString) => {
        // Expects ISO string (e.g., "2025-02-20T00:00:00.000Z")
        if (!dateString) return "";
        return dateString.split("T")[0];
    };

    const formatTimeForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const pad = (n) => (n < 10 ? "0" + n : n);
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const token = localStorage.getItem("authToken");

    // Fetch the match details using matchId
    useEffect(() => {
        if (matchId) {
            axios.get(`https://localhost:7031/api/Match/${matchId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
                .then((response) => {
                    const data = response.data;
                    setFormData({
                        leagueId: data.leagueId, // Although we already have leagueId from URL, use the fetched value if needed
                        team1Id: data.team1Id,
                        team2Id: data.team2Id,
                        matchDate: formatDateForInput(data.matchDate),
                        startTime: formatTimeForInput(data.startTime),
                        venue: data.venue,
                        status: data.status || 'Scheduled',
                    });
                })
                .catch((error) => {
                    console.error('Error fetching match details:', error);
                    setErrorMessage('Error fetching match details.');
                });
        }
    }, [matchId]);

    // Fetch teams for the given league using leagueId from useParams
    useEffect(() => {
        if (!leagueId) {
            console.error('League ID not found in the URL.');
            return;
        }
        axios.get(`https://localhost:7031/api/Team/league/${leagueId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then((response) => {
                setTeams(response.data);
            })
            .catch((error) => {
                console.error('Error fetching teams:', error);
            });
    }, [leagueId]);

    // Handle input changes for text and select fields
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Basic validation for required fields
    const validateForm = () => {
        const newErrors = {};
        if (!formData.team1Id) newErrors.team1Id = 'Please select Team 1.';
        if (!formData.team2Id) newErrors.team2Id = 'Please select Team 2.';
        if (formData.team1Id && formData.team2Id && formData.team1Id === formData.team2Id) {
            newErrors.team2Id = 'Team 1 and Team 2 cannot be the same.';
        }
        if (!formData.matchDate) newErrors.matchDate = 'Match Date is required.';
        if (!formData.startTime) newErrors.startTime = 'Start Time is required.';
        if (!formData.venue) newErrors.venue = 'Venue is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        // Prepare the payload; convert matchDate and startTime back into ISO strings
        const updatedMatch = {
            matchId: parseInt(matchId, 10),
            leagueId: parseInt(leagueId, 10),
            team1Id: parseInt(formData.team1Id, 10),
            team2Id: parseInt(formData.team2Id, 10),
            matchDate: new Date(formData.matchDate).toISOString(),
            startTime: new Date(`${formData.matchDate}T${formData.startTime}`).toISOString(),
            venue: formData.venue,
            status: formData.status,
        };

        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`https://localhost:7031/api/Match/updatematch/${matchId}`, updatedMatch, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            navigate(`/`);
        } catch (err) {
            console.error('Error updating match:', err);
            alert('An error occurred while updating the match.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-team-container">
            <Sidebar />
            <div className="add-team-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Update Match</h1>
                    {errorMessage && <div className="error-text">{errorMessage}</div>}
                    <form onSubmit={handleSubmit} className="team-form">
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
                                placeholder="Enter Match Date"
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
                                placeholder="Enter Start Time"
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

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-input"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update Match'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateMatch;
