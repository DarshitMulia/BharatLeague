import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import Sidebar from "../sidebar/Sidebar";
import './addteam.css';
import "../createleague/createleague.css";

const AddTeam = () => {
    const { leagueId } = useParams();

    const [formData, setFormData] = useState({
        leagueId: leagueId || '', 
        teamName: '',
        city: '',
        coachName: '',
        foundedYear: '',
        imageFile: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        teamName: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!leagueId) {
            console.error('League ID not found in the URL.');
        } else {
            setFormData((prevData) => ({ ...prevData, leagueId }));
        }
    }, [leagueId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
    };

    const validateTeamName = (name) => {
        if (name && !isNaN(name.charAt(0))) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                teamName: 'Team name cannot start with a number.',
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                teamName: '',
            }));
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateTeamName(formData.teamName)) {
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('LeagueId', formData.leagueId);
        data.append('TeamName', formData.teamName);
        data.append('City', formData.city);
        data.append('CoachName', formData.coachName);
        data.append('FoundedYear', formData.foundedYear);
        data.append('ImageFile', formData.imageFile);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('https://localhost:7031/api/Team/addteam', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                },
            });
            navigate(`/viewteams/${leagueId}`);
            console.log(response.data);
            setIsSubmitting(false);
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while adding the team.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-team-container">
            <Sidebar />
            <div className="add-team-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Add New Team</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="team-form">
                        <div className="form-group">
                            <label className="form-label">Team Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="teamName"
                                placeholder='Enter Team Name'
                                value={formData.teamName}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    validateTeamName(e.target.value);
                                }}
                                required
                            />
                            {errors.teamName && <p className="error-text">{errors.teamName}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">City</label>
                            <input
                                className="form-input"
                                type="text"
                                name="city"
                                placeholder='Enter City'
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Coach Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="coachName"
                                placeholder='Enter Coach Name'
                                value={formData.coachName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Founded Year</label>
                            <input
                                className="form-input"
                                type="number"
                                name="foundedYear"
                                placeholder='Enter Founded Year'
                                value={formData.foundedYear}
                                onChange={handleInputChange}
                                min="1800"
                                max={new Date().getFullYear()}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Team Logo</label>
                            <div className="file-input-container">
                                <input
                                    type="file"
                                    name="imageFile"
                                    onChange={handleFileChange}
                                    className="file-input"
                                    id="file-upload"
                                    required
                                />
                                <label htmlFor="file-upload" className="file-input-label">
                                    Choose File
                                </label>
                                <span className="file-name">
                                    {formData.imageFile ? formData.imageFile.name : 'No file chosen'}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Add Team'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTeam;
