import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../sidebar/Sidebar";
import './createLeague.css';

const CreateLeague = () => {
    const [formData, setFormData] = useState({
        userId: '',
        leagueName: '',
        country: '',
        imageFile: null,
        startDate: '',
        endDate: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        leagueName: '',
    });

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setFormData((prevData) => ({ ...prevData, userId: storedUserId }));
        } else {
            console.error('User ID not found. Please log in.');
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
    };

    const validateLeagueName = (name) => {
        if (name && !isNaN(name.charAt(0))) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                leagueName: 'League name cannot start with a number.',
            }));
            return false;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                leagueName: '',
            }));
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateLeagueName(formData.leagueName)) {
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('UserId', formData.userId);
        data.append('LeagueName', formData.leagueName);
        data.append('Country', formData.country);
        data.append('ImageFile', formData.imageFile);
        data.append('StartDate', formData.startDate);
        data.append('EndDate', formData.endDate);

        try {
            const response = await axios.post('https://localhost:7031/api/League/addleague', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('League created successfully!');
            console.log(response.data);
            setIsSubmitting(false);
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while creating the league.');
            setIsSubmitting(false);
        }
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
                                placeholder='Enter League Name'
                                value={formData.leagueName}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    validateLeagueName(e.target.value);
                                }}
                                required
                            />
                            {errors.leagueName && <p className="error-text">{errors.leagueName}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Country</label>
                            <select
                                className="form-input"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                required
                            >
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
                                    required
                                />
                            </div>
                            <div className="date-group">
                                <label className="form-label">End Date</label>
                                <input
                                    className="form-input date-input"
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">League Logo</label>
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
                            {isSubmitting ? 'Submitting...' : 'Create League'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateLeague;
