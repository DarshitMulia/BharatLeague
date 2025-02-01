import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import '../addteam/addteam.css';
import "../createleague/createleague.css";
import "../updateleague/updateleague.css";

const UpdateTeam = () => {
    const { leagueId, teamId } = useParams();

    const [formData, setFormData] = useState({
        leagueId: leagueId || '',
        teamName: '',
        city: '',
        coachName: '',
        foundedYear: '',
        imageFile: null,
    });

    const [currentImage, setCurrentImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        teamName: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (teamId) {
            axios
                .get(`https://localhost:7031/api/Team/${teamId}`)
                .then((response) => {
                    const data = response.data;
                    setFormData({
                        leagueId: data.leagueId,
                        teamName: data.teamName,
                        city: data.city,
                        coachName: data.coachName,
                        foundedYear: data.foundedYear,
                        imageFile: null, 
                    });
                    setCurrentImage(data.imageUrl || null); 
                })
                .catch((error) => {
                    console.error('Error fetching team details:', error);
                });
        }
    }, [teamId]);

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
        data.append('TeamId', teamId);
        data.append('LeagueId', formData.leagueId);
        data.append('TeamName', formData.teamName);
        data.append('City', formData.city);
        data.append('CoachName', formData.coachName);
        data.append('FoundedYear', formData.foundedYear);
        if (formData.imageFile) {
            data.append('ImageFile', formData.imageFile);
        }

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(`https://localhost:7031/api/Team/updateteam/${teamId}`, data, {
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
            alert('An error occurred while updating the team.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-team-container">
            <Sidebar />
            <div className="add-team-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Update Team</h1>
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
                            {currentImage && (
                                <div className="current-image-preview">
                                    <img src={currentImage} alt="Current Team Logo" />
                                </div>
                            )}
                            <div className="file-input-container">
                                <input
                                    type="file"
                                    name="imageFile"
                                    onChange={handleFileChange}
                                    className="file-input"
                                    id="file-upload"
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
                            {isSubmitting ? 'Submitting...' : 'Update Team'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateTeam;
