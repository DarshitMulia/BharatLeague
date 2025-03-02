import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "../addteam/addteam.css";
import "../createleague/createleague.css";
import "../updateleague/updateleague.css";

const UpdateTeam = () => {
    const { leagueId, teamId } = useParams();
    const [formData, setFormData] = useState({
        leagueId: leagueId || "",
        teamName: "",
        city: "",
        coachName: "",
        foundedYear: "",
        imageFile: null,
    });
    
    const token = localStorage.getItem("authToken");
    const [currentImage, setCurrentImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (teamId) {
            axios
                .get(`https://localhost:7031/api/Team/${teamId}`, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                })
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
                    console.error("Error fetching team details:", error);
                });
        }
    }, [teamId, token]);

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
        const currentYear = new Date().getFullYear();
        if (!formData.leagueId || Number(formData.leagueId) <= 0) {
            newErrors.leagueId = "LeagueId must be greater than 0.";
        }
        if (!formData.teamName.trim()) {
            newErrors.teamName = "Team name is required.";
        } else if (formData.teamName.length > 100) {
            newErrors.teamName = "Team name must not exceed 100 characters.";
        } else if (!isNaN(formData.teamName.charAt(0))) {
            newErrors.teamName = "Team name cannot start with a number.";
        }
        if (!formData.city.trim()) {
            newErrors.city = "City is required.";
        } else if (formData.city.length > 50) {
            newErrors.city = "City must not exceed 50 characters.";
        }
        if (!formData.coachName.trim()) {
            newErrors.coachName = "Coach name is required.";
        } else if (formData.coachName.length > 100) {
            newErrors.coachName = "Coach name must not exceed 100 characters.";
        }
        if (!formData.foundedYear) {
            newErrors.foundedYear = "Founded year is required.";
        } else {
            const year = Number(formData.foundedYear);
            if (year < 1800 || year > currentYear) {
                newErrors.foundedYear = `Founded year must be between 1800 and ${currentYear}.`;
            }
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
        data.append("TeamId", teamId);
        data.append("LeagueId", formData.leagueId);
        data.append("TeamName", formData.teamName);
        data.append("City", formData.city);
        data.append("CoachName", formData.coachName);
        data.append("FoundedYear", formData.foundedYear);
        if (formData.imageFile) {
            data.append("ImageFile", formData.imageFile);
        }
        try {
            const response = await axios.put(`https://localhost:7031/api/Team/updateteam/${teamId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            navigate(`/viewteams/${leagueId}`);
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while updating the team.");
        }
        setIsSubmitting(false);
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
                                placeholder="Enter Team Name"
                                value={formData.teamName}
                                onChange={handleInputChange}
                            />
                            {errors.teamName && <p className="error-text">{errors.teamName}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">City</label>
                            <input
                                className="form-input"
                                type="text"
                                name="city"
                                placeholder="Enter City"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                            {errors.city && <p className="error-text">{errors.city}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Manager Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="coachName"
                                placeholder="Enter Manager Name"
                                value={formData.coachName}
                                onChange={handleInputChange}
                            />
                            {errors.coachName && <p className="error-text">{errors.coachName}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Founded Year</label>
                            <input
                                className="form-input"
                                type="number"
                                name="foundedYear"
                                placeholder="Enter Founded Year"
                                value={formData.foundedYear}
                                onChange={handleInputChange}
                                min="1800"
                                max={new Date().getFullYear()}
                            />
                            {errors.foundedYear && <p className="error-text">{errors.foundedYear}</p>}
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
                                    {formData.imageFile ? formData.imageFile.name : "No file chosen"}
                                </span>
                            </div>
                        </div>
                        <div className="button-group">
                            <button type="button" className="back-button" onClick={() => navigate(-1)}>
                                Back
                            </button>
                            <button type="submit" className="submit-button" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Update Team"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateTeam;
