import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import './addplayer.css';
import "../createleague/createleague.css";

const AddPlayer = () => {
    const { teamId } = useParams();

    const [formData, setFormData] = useState({
        teamId: teamId || '',
        playerName: '',
        age: '',
        jerseyNumber: '',
        position: '',
        imageFile: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        playerName: '',
        age: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!teamId) {
            console.error('Team ID not found in the URL.');
        } else {
            setFormData((prevData) => ({ ...prevData, teamId }));
        }
    }, [teamId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
    };

    const validatePlayerName = (name) => {
        if (name && !isNaN(name.charAt(0))) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                playerName: 'Player name cannot start with a number.',
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                playerName: '',
            }));
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validatePlayerName(formData.playerName)) {
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('TeamId', formData.teamId);
        data.append('PlayerName', formData.playerName);
        data.append('ImageFile', formData.imageFile);
        data.append('Age', formData.age);
        data.append('JerseyNumber', formData.jerseyNumber);
        data.append('Position', formData.position);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('https://localhost:7031/api/Player/addplayer', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                },
            });
            navigate(`/viewplayers/${teamId}`);
            console.log(response.data);
            setIsSubmitting(false);
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while adding the player.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-player-container">
            <Sidebar />
            <div className="add-player-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Add New Player</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="player-form">
                        <div className="form-group">
                            <label className="form-label">Player Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="playerName"
                                placeholder="Enter Player Name"
                                value={formData.playerName}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    validatePlayerName(e.target.value);
                                }}
                                required
                            />
                            {errors.playerName && <p className="error-text">{errors.playerName}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Age</label>
                            <input
                                className="form-input"
                                type="number"
                                name="age"
                                placeholder="Enter Player Age"
                                value={formData.age}
                                onChange={handleInputChange}
                                min="1"
                                max="50"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Jersey Number</label>
                            <input
                                className="form-input"
                                type="number"
                                name="jerseyNumber"
                                placeholder="Enter Jersey Number"
                                value={formData.jerseyNumber}
                                onChange={handleInputChange}
                                min="0"
                                max="99"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Position</label>
                            <select
                                className="form-input"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">
                                    Select Position
                                </option>
                                <option value="Forward">Forward</option>
                                <option value="Midfielder">Midfielder</option>
                                <option value="Defender">Defender</option>
                                <option value="Goalkeeper">Goalkeeper</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Player Photo</label>
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
                                {isSubmitting ? 'Submitting...' : 'Add Player'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPlayer;
