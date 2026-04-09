import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../style/interview.scss';
import { useInterview } from "../hooks/useInterview.js"
import { useParams } from "react-router"



const Interview = () => {
    const { report, getReportById, loading ,getResumePdf } = useInterview();
    const { interviewId } = useParams();
    const [activeNav, setActiveNav] = useState('technical');
    const [expandedTechnical, setExpandedTechnical] = useState([]);
    const [expandedBehavioral, setExpandedBehavioral] = useState([]);
    const [animatedScore, setAnimatedScore] = useState(0);

    const [completedDays, setCompletedDays] = useState([]);
    const toggleDayComplete = (day) => {
    setCompletedDays(prev => 
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
};


   useEffect(() => {
    if (interviewId) {
        getReportById(interviewId);
    }
}, [interviewId]);

    useEffect(() => {
        if (report?.matchScore !== undefined) {
            const timeout = setTimeout(() => {
                setAnimatedScore(Math.max(0, Math.min(100, report.matchScore)));
            }, 80);
            return () => clearTimeout(timeout);
        }
    }, [report?.matchScore]);


    if (loading || !report) {
    return (
        <main className="loading-screen">
            <svg width="40" height="40" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#3498db" strokeWidth="5" strokeDasharray="31.4 31.4"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
            <h1>Please Wait...</h1>
        </main>
    );
}

    // --- HELPER FUNCTIONS ---

    const toggleExpand = (id, type) => {
        const state = type === 'technical' ? expandedTechnical : expandedBehavioral;
        const setter = type === 'technical' ? setExpandedTechnical : setExpandedBehavioral;
        setter(state.includes(id) ? state.filter((item) => item !== id) : [...state, id]);
    };

    const renderQuestions = (items, type) => (
        <div className="qa-list">
            {(items || []).map((item, index) => {
                const isOpen = (type === 'technical' ? expandedTechnical : expandedBehavioral).includes(index);
                return (
                    <div key={`${type}-${index}`} className={`qa-card ${isOpen ? 'open' : ''}`}>
                        <button className="qa-summary" onClick={() => toggleExpand(index, type)}>
                            <span>{item.question}</span>
                            <span className="chevron">{isOpen ? '▾' : '▸'}</span>
                        </button>
                        {isOpen && (
                            <div className="qa-detail">
                                <p><strong>Intention:</strong> {item.intention}</p>
                                <p><strong>Sample Answer:</strong> {item.answer}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    const buildSkillTag = (gap) => {
        const className = gap.severity === 'high' ? 'tag-high' : gap.severity === 'medium' ? 'tag-medium' : 'tag-low';
        return (
            <span key={gap.skill} className={`skill-tag ${className}`}>
                {gap.skill}
            </span>
        );
    };

    const renderPreparationPlan = () => (
    <div className="prep-timeline">
        {(report.preparationPlan || []).map((step) => {
            const isDone = completedDays.includes(step.day);
            return (
                <div 
                    key={step.day} 
                    className={`prep-step ${isDone ? 'completed' : ''}`}
                    onClick={() => toggleDayComplete(step.day)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="prep-indicator">
                        <div className="dot" style={isDone ? { borderColor: '#37d69e', color: '#37d69e' } : {}}>
                            {isDone ? '✓' : step.day}
                        </div>
                    </div>
                    
                    <div className="prep-content">
                        <h4>
                            {step.focus}
                            {isDone && <span style={{ fontSize: '0.7rem', color: '#37d69e' }}>COMPLETED</span>}
                        </h4>
                        <ul>
                            {step.tasks.map((task, i) => (
                                <li key={i}>{task}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        })}
    </div>
);

    const renderMain = () => {
        switch (activeNav) {
            case 'technical':
                return renderQuestions(report.technicalQuestions, 'technical');
            case 'behavioral':
                return renderQuestions(report.behavioralQuestions, 'behavioral');
            case 'preparationPlan':
                return renderPreparationPlan();
            default:
                return null;
        }
    };

    // Safe access to scores
    const score = report.matchScore || 0;

    return (
        <div className="interview-page">
            <div className="interview-layout">
                <nav className="interview-nav">
                    <div>
                        <h3>Sections</h3>
                        <div className={`nav-item ${activeNav === 'technical' ? 'active' : ''}`} onClick={() => setActiveNav('technical')}>Technical Questions</div>
                        <div className={`nav-item ${activeNav === 'behavioral' ? 'active' : ''}`} onClick={() => setActiveNav('behavioral')}>Behavioral Questions</div>
                        <div className={`nav-item ${activeNav === 'preparationPlan' ? 'active' : ''}`} onClick={() => setActiveNav('preparationPlan')}>Preparation Plan</div>
                    </div>
                    <button 
                    onClick={()=>{getResumePdf(interviewId)}}
                    className='button primary-button'>
                    <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                         Download Resume
                    </button>
                </nav>

                <main className="interview-content">
                    {renderMain()}
                </main>

                <aside className="interview-sidebar">
                    <div className="score-section">
                        <div className="score-circle" role="img" aria-label={`Match score ${score} percent`}>
                            <CircularProgressbar
                                value={animatedScore}
                                text={`${score}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'round',
                                    pathColor: score >= 75 ? '#37d69e' : score >= 45 ? '#ffb84d' : '#ff4f6f',
                                    textColor: '#fff',
                                    trailColor: 'rgba(255, 255, 255, 0.15)',
                                    textSize: '22px'
                                })}
                            />
                        </div>
                        <small>Match Score</small>
                    </div>
                    <div className="insight-card">
                        <strong>Skill Gaps</strong>
                        <div className="skill-gap-grid">
                            {(report.skillGaps || []).map(buildSkillTag)}
                        </div>
                    </div>
                    <div className="insight-card">
                        <strong>Quick Overview</strong>
                        <p>Active tab: {activeNav}</p>
                        <p>Total Technical: {report.technicalQuestions?.length || 0}</p>
                        <p>Total Behavioral: {report.behavioralQuestions?.length || 0}</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Interview;