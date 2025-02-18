import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "../addplayer/addplayer.css";

const UpdatePlayer = () => {
    const { teamId, playerId } = useParams();
    const [formData, setFormData] = useState({
        teamId: teamId || "",
        playerName: "",
        position: "",
        jerseyNumber: "",
        nationality: "",
        age: "",
        imageFile: null,
    });

    const [currentImage, setCurrentImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (playerId) {
            axios
                .get(`https://localhost:7031/api/Player/${playerId}`, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
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
                })
                .catch((error) => {
                    console.error("Error fetching player details:", error);
                });
        }
    }, [playerId, token]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
        setErrors((prev) => ({ ...prev, imageFile: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.teamId || Number(formData.teamId) <= 0) {
            newErrors.teamId = "TeamId must be greater than 0.";
        }
        if (!formData.playerName.trim()) {
            newErrors.playerName = "Player name is required.";
        } else if (formData.playerName.length > 100) {
            newErrors.playerName = "Player name must not exceed 100 characters.";
        } else if (!isNaN(formData.playerName.charAt(0))) {
            newErrors.playerName = "Player name cannot start with a number.";
        }
        if (!formData.age) {
            newErrors.age = "Age is required.";
        } else {
            const age = Number(formData.age);
            if (age < 16 || age > 60) {
                newErrors.age = "Age must be between 16 and 60.";
            }
        }
        if (formData.jerseyNumber === "" || formData.jerseyNumber === null) {
            newErrors.jerseyNumber = "Jersey number is required.";
        } else {
            const jersey = Number(formData.jerseyNumber);
            if (jersey < 0 || jersey > 99) {
                newErrors.jerseyNumber = "Jersey number must be between 0 and 99.";
            }
        }
        if (!formData.position.trim()) {
            newErrors.position = "Position is required.";
        } else if (formData.position.length > 50) {
            newErrors.position = "Position must not exceed 50 characters.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }
        const data = new FormData();
        data.append("PlayerId", playerId);
        data.append("TeamId", formData.teamId);
        data.append("PlayerName", formData.playerName);
        data.append("Position", formData.position);
        data.append("JerseyNumber", formData.jerseyNumber);
        data.append("Nationality", formData.nationality);
        data.append("Age", formData.age);
        if (formData.imageFile) {
            data.append("ImageFile", formData.imageFile);
        }
        try {
            const response = await axios.put(
                `https://localhost:7031/api/Player/updateplayer/${playerId}`,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log(response.data);
            navigate(`/viewplayers/${teamId}`);
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while updating the player.");
        }
        setIsSubmitting(false);
    };
    
    return (
        <div className="add-player-container">
            <Sidebar />
            <div className="add-player-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Update Player</h1>
                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="player-form"
                    >
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
                                }}
                            />
                            {errors.playerName && (
                                <p className="error-text">{errors.playerName}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Age</label>
                            <input
                                className="form-input"
                                type="number"
                                name="age"
                                placeholder="Enter Age"
                                value={formData.age}
                                onChange={handleInputChange}
                                min="16"
                                max="60"
                            />
                            {errors.age && <p className="error-text">{errors.age}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Jersey Number</label>
                            <input
                                className="form-input"
                                type="number"
                                name="jerseyNumber"
                                placeholder="Enter Jersey Number"
                                value={formData.jerseyNumber}
                                onChange={(e) => {
                                    handleInputChange(e);
                                }}
                                min="0"
                                max="99"
                            />
                            {errors.jerseyNumber && (
                                <p className="error-text">{errors.jerseyNumber}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Position</label>
                            <select
                                className="form-input"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Position</option>
                                <option value="Forward">Forward</option>
                                <option value="Midfielder">Midfielder</option>
                                <option value="Defender">Defender</option>
                                <option value="Goalkeeper">Goalkeeper</option>
                            </select>
                            {errors.position && (
                                <p className="error-text">{errors.position}</p>
                            )}
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
                                    {formData.imageFile
                                        ? formData.imageFile.name
                                        : "No file chosen"}
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
                                {isSubmitting ? "Submitting..." : "Update Player"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePlayer;
