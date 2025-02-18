import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import "./createLeague.css";

const CreateLeague = () => {
    const [formData, setFormData] = useState({
        userId: "",
        leagueName: "",
        country: "",
        imageFile: null,
        startDate: "",
        endDate: "",
        status: "Scheduled",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setFormData((prevData) => ({ ...prevData, userId: storedUserId }));
        } else {
            console.error("User ID not found. Please log in.");
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
        setErrors((prevErrors) => ({ ...prevErrors, imageFile: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        const { userId, leagueName, country, startDate, endDate, status, imageFile } = formData;
        if (!userId || parseInt(userId, 10) <= 0) {
            newErrors.userId = "Invalid user id.";
        }
        if (!leagueName.trim()) {
            newErrors.leagueName = "League name is required.";
        } else if (leagueName.length < 3) {
            newErrors.leagueName = "League name must be at least 3 characters long.";
        } else if (leagueName.length > 100) {
            newErrors.leagueName = "League name must not exceed 100 characters.";
        } else if (!isNaN(leagueName.charAt(0))) {
            newErrors.leagueName = "League name cannot start with a number.";
        }
        if (!country.trim()) {
            newErrors.country = "Country is required.";
        } else if (country.length < 2) {
            newErrors.country = "Country must be at least 2 characters long.";
        } else if (country.length > 100) {
            newErrors.country = "Country must not exceed 100 characters.";
        }
        if (!startDate) {
            newErrors.startDate = "Start date is required.";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const sDate = new Date(startDate);
            if (sDate < today) {
                newErrors.startDate = "Start date cannot be in the past.";
            }
            if (endDate) {
                const eDate = new Date(endDate);
                if (sDate >= eDate) {
                    newErrors.startDate = "Start date must be before end date.";
                }
            }
        }
        if (!endDate) {
            newErrors.endDate = "End date is required.";
        } else if (startDate) {
            const sDate = new Date(startDate);
            const eDate = new Date(endDate);
            if (eDate <= sDate) {
                newErrors.endDate = "End date must be after start date.";
            }
        }
        if (!imageFile) {
            newErrors.imageFile = "League logo is required.";
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
        setErrors({});
        const data = new FormData();
        data.append("UserId", formData.userId);
        data.append("LeagueName", formData.leagueName);
        data.append("Country", formData.country);
        data.append("ImageFile", formData.imageFile);
        data.append("StartDate", formData.startDate);
        data.append("EndDate", formData.endDate);
        data.append("Status", formData.status);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post("https://localhost:7031/api/League/addleague", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            navigate(-1);
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while creating the league.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="create-league-container">
            <Sidebar />
            <div className="create-league-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Create New League</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="league-form">
                        <div className="form-group">
                            <label className="form-label">League Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="leagueName"
                                placeholder="Enter League Name"
                                value={formData.leagueName}
                                onChange={handleInputChange}
                            />
                            {errors.leagueName && <p className="error-text">{errors.leagueName}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Country</label>
                            <select className="form-input" name="country" value={formData.country} onChange={handleInputChange}>
                                <option value="">Select Country</option>
                                <option value="Brazil">Brazil</option>
                                <option value="India">India</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Germany">Germany</option>
                                <option value="Spain">Spain</option>
                                <option value="France">France</option>
                                <option value="Italy">Italy</option>
                                <option value="England">England</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Colombia">Colombia</option>
                            </select>
                            {errors.country && <p className="error-text">{errors.country}</p>}
                        </div>
                        <div className="date-container">
                            <div className="date-group">
                                <label className="form-label">Start Date</label>
                                <input
                                    className="form-input date-input"
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                />
                                {errors.startDate && <p className="error-text">{errors.startDate}</p>}
                            </div>
                            <div className="date-group">
                                <label className="form-label">End Date</label>
                                <input
                                    className="form-input date-input"
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                                {errors.endDate && <p className="error-text">{errors.endDate}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">League Logo</label>
                            <div className="file-input-container">
                                <input type="file" name="imageFile" onChange={handleFileChange} className="file-input" id="file-upload" />
                                <label htmlFor="file-upload" className="file-input-label">
                                    Choose File
                                </label>
                                <span className="file-name">
                                    {formData.imageFile ? formData.imageFile.name : "No file chosen"}
                                </span>
                                {errors.imageFile && <p className="error-text">{errors.imageFile}</p>}
                            </div>
                        </div>
                        <div className="button-group">
                            <button type="button" className="back-button" onClick={() => navigate(-1)}>
                                Back
                            </button>
                            <button type="submit" className="submit-button" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Create League"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateLeague;
