import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "./updateleague.css";

const UpdateLeague = () => {
    const { leagueId } = useParams();
    const navigate = useNavigate();

    const [leagueDetails, setLeagueDetails] = useState({
        leagueName: "",
        country: "",
        startDate: "",
        endDate: "",
        imageFile: null,
    });
    const [currentImage, setCurrentImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("authToken")

    useEffect(() => {
        const fetchLeagueDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7031/api/League/${leagueId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
                );
                const data = response.data;

                const formatDate = (dateString) => dateString.split("T")[0];

                setLeagueDetails({
                    leagueName: data.leagueName,
                    country: data.country,
                    startDate: formatDate(data.startDate),
                    endDate: formatDate(data.endDate),
                    imageFile: null,
                });

                setCurrentImage(data.imageUrl || null);
                setIsLoading(false);
            } catch (err) {
                setError("Failed to fetch league details.");
                setIsLoading(false);
            }
        };
        fetchLeagueDetails();
    }, [leagueId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeagueDetails({ ...leagueDetails, [name]: value });
    };

    const handleFileChange = (e) => {
        setLeagueDetails({ ...leagueDetails, imageFile: e.target.files[0] });
    };

    const validateLeagueName = (name) => {
        if (name && !isNaN(name.charAt(0))) {
            setError("League name cannot start with a number.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateLeagueName(leagueDetails.leagueName)) {
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append("LeagueName", leagueDetails.leagueName);
        formData.append("Country", leagueDetails.country);
        formData.append("StartDate", leagueDetails.startDate);
        formData.append("EndDate", leagueDetails.endDate);
        if (leagueDetails.imageFile) {
            formData.append("ImageFile", leagueDetails.imageFile);
        }

        try {
            const response = await axios.put(
                `https://localhost:7031/api/League/UpdateLeague/${leagueId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            setSuccess("League updated successfully!");
            setError("");
            navigate("/manageleague");
        } catch (err) {
            setError(err.response?.data || "An error occurred while updating the league.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div>Loading league details...</div>;
    }

    return (
        <div className="create-league-container">
            <Sidebar />
            <div className="create-league-main-content">
                <div className="form-wrapper">
                    <h1 className="form-heading">Update League</h1>
                    {error && <div className="error-text">{error}</div>}
                    {success && <div className="success-text">{success}</div>}
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="league-form">
                        <div className="form-group">
                            <label className="form-label">League Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="leagueName"
                                placeholder="Enter League Name"
                                value={leagueDetails.leagueName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Country</label>
                            <select
                                className="form-input"
                                name="country"
                                value={leagueDetails.country}
                                onChange={handleChange}
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
                                    value={leagueDetails.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="date-group">
                                <label className="form-label">End Date</label>
                                <input
                                    className="form-input date-input"
                                    type="date"
                                    name="endDate"
                                    value={leagueDetails.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">League Logo</label>
                            {currentImage && (
                                <div className="current-image-preview">
                                    <img src={currentImage} alt="Current League Logo" />
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
                                    {leagueDetails.imageFile ? leagueDetails.imageFile.name : "No file chosen"}
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
                                {isSubmitting ? 'Submitting...' : 'Update League'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateLeague;
