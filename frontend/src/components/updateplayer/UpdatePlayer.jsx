import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import "../addplayer/addplayer.css";

const UpdatePlayer = () => {
    const { teamId, playerId } = useParams();

    const [formData, setFormData] = useState({
        teamId: teamId || '',
        playerName: '',
        position: '',
        jerseyNumber: '',
        nationality: '',
        age: '',
        imageFile: null,
    });

    const [currentImage, setCurrentImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        playerName: '',
        jerseyNumber: '',
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (playerId) {
            axios.get(`https://localhost:7031/api/Player/${playerId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            }).then((response) => {
                const data = response.data;
                setFormData({
                    teamId: data.teamId,
                    playerName: data.playerName,
                    position: data.position,
                    jerseyNumber: data.jerseyNumber,
                    nationality: data.nationality,
                    age: data.age,
                    imageFile: null,
                });
                setCurrentImage(data.imageUrl || null);
            }).catch((error) => {
                console.error('Error fetching player details:', error);
            });
        }
    }, [playerId]);

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

    const validateJerseyNumber = (jerseyNumber) => {
        if (jerseyNumber && isNaN(jerseyNumber)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                jerseyNumber: 'Jersey number must be a valid number.',
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                jerseyNumber: '',
            }));
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validatePlayerName(formData.playerName) || !validateJerseyNumber(formData.jerseyNumber)) {
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('PlayerId', playerId);
        data.append('TeamId', formData.teamId);
        data.append('PlayerName', formData.playerName);
        data.append('Position', formData.position);
        data.append('JerseyNumber', formData.jerseyNumber);
        data.append('Nationality', formData.nationality);
        data.append('Age', formData.age);
        if (formData.imageFile) {
            data.append('ImageFile', formData.imageFile);
        }

        try {
            const response = await axios.put(`https://localhost:7031/api/Player/updateplayer/${playerId}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate(`/viewplayers/${teamId}`);
            console.log(response.data);
            setIsSubmitting(false);
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while updating the player.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-player-container">
            <Sidebar />
            <div className="add-player-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Update Player</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="player-form">
                        <div className="form-group">
                            <label className="form-label">Player Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="playerName"
                                placeholder='Enter Player Name'
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
                                placeholder='Enter Age'
                                value={formData.age}
                                onChange={handleInputChange}
                                min="15"
                                max="50"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Jersey Number</label>
                            <input
                                className="form-input"
                                type="text"
                                name="jerseyNumber"
                                placeholder='Enter Jersey Number'
                                value={formData.jerseyNumber}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    validateJerseyNumber(e.target.value);
                                }}
                                required
                            />
                            {errors.jerseyNumber && <p className="error-text">{errors.jerseyNumber}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Position</label>
                            <input
                                className="form-input"
                                type="text"
                                name="position"
                                placeholder='Enter Position'
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Player Image</label>
                            {currentImage && (
                                <div className="current-image-preview">
                                    <img src={currentImage} alt="Current Player Image" />
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
                            {isSubmitting ? 'Submitting...' : 'Update Player'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePlayer;
