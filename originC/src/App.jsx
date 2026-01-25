import React, { useState, useEffect } from 'react';
import { useLocation } from './modules/location/useLocation';
import { fetchHazards } from './modules/hazard/hazardService';
import { checkTrigger } from './modules/logic/triggerLogic';
import { generateAdvice } from './modules/advice/adviceService';
import './index.css';

function App() {
  const { location, loading: locLoading, error: locError, getGPSLocation, getCoordsFromZip, clearLocation } = useLocation();
  const [zip, setZip] = useState('');
  const [hazards, setHazards] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (location) {
      handleCheckHazards();
    }
  }, [location]);

  const handleCheckHazards = async () => {
    setLoading(true);
    const data = await fetchHazards(location.latitude, location.longitude);
    setHazards(data);

    const { trigger_alert, alerts } = checkTrigger(data);
    if (trigger_alert) {
      const advice = await generateAdvice(alerts[0]);
      setAlert(advice);
    } else {
      setAlert(null);
    }
    setLoading(false);
    setChecked(true);
  };

  const reset = () => {
    setAlert(null);
    setChecked(false);
    setZip('');
    clearLocation();
  };

  return (
    <div className="app-container">
      {!location ? (
        <div className="glass-card">
          <h1>Climate Alert</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Get pre-disaster behavioral advice based on your location.
          </p>

          <button className="btn-primary" onClick={getGPSLocation} style={{ width: '100%', marginBottom: '1rem' }}>
            Use Device GPS
          </button>

          <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-secondary)' }}>or</div>

          <input
            type="text"
            className="input-field"
            placeholder="Enter ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={() => getCoordsFromZip(zip)}
            style={{ width: '100%' }}
            disabled={!zip}
          >
            Check by ZIP
          </button>

          {locError && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{locError}</p>}
        </div>
      ) : (
        <div className="glass-card">
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <h2>Checking Hazards...</h2>
              <div className="loader"></div>
            </div>
          ) : checked ? (
            alert ? (
              <div className="alert-display">
                <h2 style={{ color: 'var(--accent-heat)', marginBottom: '1.5rem' }}>⚠️ {alert.title}</h2>

                <div className="advice-section">
                  <h3>Avoid:</h3>
                  <ul>
                    {alert.avoid.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

                <div className="advice-section">
                  <h3>Recommended:</h3>
                  <ul>
                    {alert.recommended.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

                <div className="advice-section">
                  <h3>Why this matters:</h3>
                  <p>{alert.why}</p>
                </div>

                <button className="btn-primary" onClick={reset} style={{ marginTop: '2rem', width: '100%' }}>
                  Check Another Location
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: 'var(--accent-air)' }}>✅ All Clear</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '1.5rem 0' }}>
                  No severe environmental hazards detected for your location at this time.
                </p>
                <button className="btn-primary" onClick={reset} style={{ width: '100%' }}>
                  Change Location
                </button>
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;
