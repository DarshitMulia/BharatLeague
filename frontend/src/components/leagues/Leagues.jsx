import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../sidebar/Sidebar";
import { FiSearch, FiX, FiCalendar, FiFlag, FiAward } from 'react-icons/fi';
import './leagues.css';
import { Link } from 'react-router-dom';

const Leagues = () => {
    const [leagues, setLeagues] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        fetchLeagues();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            searchLeagues();
        } else {
            fetchLeagues();
        }
    }, [searchTerm]);

    const token = localStorage.getItem("authToken");

    const fetchLeagues = async () => {
        try {
            const { data } = await axios.get('https://localhost:7031/api/League/leagues', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLeagues(data);
        } catch (error) {
            console.error('Error fetching leagues:', error);
        }
    };

    const searchLeagues = async () => {
        try {
            const { data } = await axios.get(`https://localhost:7031/api/League/searchleague?searchTerm=${searchTerm}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLeagues(data);
        } catch (error) {
            console.error('Error searching leagues:', error);
        }
    };

    const filterLeagues = () => {
        let filteredLeagues = leagues;
        if (selectedCountry) {
            filteredLeagues = filteredLeagues.filter(league => league.country === selectedCountry);
        }
        if (selectedStatus) {
            filteredLeagues = filteredLeagues.filter(league => league.status === selectedStatus);
        }
        return filteredLeagues;
    };

    return (
        <div className="leagues-container">
            <Sidebar />
            <div className="content">
                <div className="header-section">
                    <h1 className="page-title">Football Leagues</h1>
                    <div className="search-filter-container">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search leagues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filters">
                            <div className="select-wrapper-dropdown">
                                <select
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    value={selectedCountry}
                                >
                                    <option value="">Country</option>
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
                                <FiFlag className="select-icon" />
                            </div>
                            <div className="select-wrapper-dropdown">
                                <select
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    value={selectedStatus}
                                >
                                    <option value="">Status</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <FiAward className="select-icon" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="league-grid">
                    {filterLeagues().map((league) => (
                        <div key={league.leagueId} className="league-card">
                            <div className="card-image">
                                <img src={league.imageUrl} alt={league.leagueName} />
                                <div className="image-overlay">
                                    <span className={`status-badge ${league.status.toLowerCase()}`}>
                                        {league.status}
                                    </span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{league.leagueName}</h3>
                                <div className="meta-info">
                                    <span className="country-flag">
                                        <FiFlag /> {league.country}
                                    </span>
                                    <span className="calendar">
                                        <FiCalendar /> {new Date(league.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <Link to={`/leaguedetails/${league.leagueId}`}
                                    className="details-button"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leagues;
