// import React from 'react';
// import './Home.css';
// import Sidebar from '../sidebar/Sidebar';
// import OngoingMatches from '../ongoingmatches/OngoingMatches';
// import { Link } from 'react-router-dom';

// const Home = () => {
//     return (
//         <div className="home-page">
//             <Sidebar />
//             <div className="home-main">
//                 <section className="hero-section">
//                     <div className="hero-content">
//                         <h1 className="hero-title">Elevate Your League Experience</h1>
//                         <p className="hero-text">
//                             Welcome to the ultimate Football League Management System—where passion meets precision.
//                             Manage teams, track performances, and celebrate every goal with cutting-edge analytics and engaging community features.
//                         </p>
//                         <Link to="/createleague" className="hero-cta">Create League</Link>
//                     </div>
//                 </section>

//                 <section className="features-section">
//                     <div className="feature">
//                         <h2 className="feature-title">Streamlined Management</h2>
//                         <p className="feature-text">
//                             Simplify scheduling, team coordination, and league operations with our intuitive interface.
//                         </p>
//                     </div>
//                     <div className="feature">
//                         <h2 className="feature-title">Real-Time Analytics</h2>
//                         <p className="feature-text">
//                             Access comprehensive, real-time insights that empower coaches, managers, and fans alike.
//                         </p>
//                     </div>
//                     <div className="feature">
//                         <h2 className="feature-title">Engaging Community</h2>
//                         <p className="feature-text">
//                             Connect with fans, celebrate victories, and share the excitement of every match.
//                         </p>
//                     </div>
//                 </section>
//                 <OngoingMatches />
//             </div>
//         </div>
//     );
// };

// export default Home;

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

                {/* Existing Component */}
                <OngoingMatches />
            </div>
        </div>
    );
};

export default Home;
