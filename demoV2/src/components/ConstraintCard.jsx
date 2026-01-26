import React from 'react';

const ConstraintCard = ({ alert, onReset }) => {
    if (!alert) return null;

    return (
        <div className="constraint-card">
            <div className="constraint-header">
                <span className="severity-indicator">⚠️</span>
                <h2>{alert.title}</h2>
            </div>

            <div className="constraint-body">
                <div className="main-constraint">
                    <h3>Movement Constraint</h3>
                    <p className="emphasis">{alert.constraint}</p>
                </div>

                <div className="detail-row">
                    <div className="detail-item">
                        <span className="label">Reason</span>
                        <p>{alert.reason}</p>
                    </div>
                </div>

                <div className="avoid-list">
                    <span className="label">Avoid Area/Actions</span>
                    <ul>
                        {alert.avoid.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <button className="btn-secondary" onClick={onReset}>
                Check Another Decision Context
            </button>
        </div>
    );
};

export default ConstraintCard;
