import React from 'react';
import './Home.css';
import Sidebar from '../sidebar/Sidebar';
import OngoingMatches from '../ongoingmatches/OngoingMatches';
import { Link } from 'react-router-dom';
import { FaCogs, FaChartBar, FaSlidersH } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="home-page">
            <Sidebar />
            <div className="home-main">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Seamless Football League Management</h1>
                        <p className="hero-subtitle">
                            Empowering clubs and leagues with modern tools to manage, analyze, and elevate every game.
                        </p>
                        <Link to="/createleague" className="hero-cta">Create Your League</Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2 className="section-header">Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaCogs />
                            </div>
                            <h3 className="feature-title">Intuitive Management</h3>
                            <p className="feature-description">
                                Organize fixtures, manage teams, and schedule matches with an interface designed for efficiency.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaChartBar />
                            </div>
                            <h3 className="feature-title">Data-Driven Insights</h3>
                            <p className="feature-description">
                                Leverage real-time analytics to track performance and make informed decisions.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaSlidersH />
                            </div>
                            <h3 className="feature-title">Customizable League Settings</h3>
                            <p className="feature-description">
                                Tailor your league with flexible settings—from fixture configurations to point systems—ensuring a personalized experience.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="testimonial-section">
                    <h2 className="section-header">What Our Users Say</h2>
                    <div className="testimonial-cards">
                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "This system has transformed the way we manage our league. The analytics feature is a true game-changer."
                            </p>
                            <p className="testimonial-author">– Club Manager, Premier League</p>
                        </div>
                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "The intuitive design and real-time data keep us ahead. It’s professional, reliable, and simple to use."
                            </p>
                            <p className="testimonial-author">– Coach, National Football Club</p>
                        </div>
                    </div>
                </section>

                <OngoingMatches />
            </div>
        </div>
    );
};

export default Home;
