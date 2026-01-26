import React, { useState, useEffect } from 'react';
import { useLocation } from './modules/location/useLocation';
import { fetchHazards } from './modules/hazard/hazardService';
import { checkTrigger } from './modules/logic/triggerLogic';
import { generateAdvice } from './modules/advice/adviceService';
import MapOverlay from './components/MapOverlay';
import ConstraintCard from './components/ConstraintCard';
import './index.css';

function App() {
  const { location, loading: locLoading, error: locError, getGPSLocation, getCoordsFromZip, clearLocation } = useLocation();
  const [zip, setZip] = useState('');
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
      <MapOverlay isRestricted={!!alert} loading={loading} location={location}>
        {!location ? (
          <div className="glass-card context-selector">
            <h1>Where are you heading?</h1>
            <p className="subtitle">
              Enter your destination to see if current climate conditions affect your route.
            </p>

            <button className="btn-primary" onClick={getGPSLocation} style={{ width: '100%', marginBottom: '1rem' }}>
              Use My Current Location
            </button>

            <div className="separator">or enter a location</div>

            <input
              type="text"
              className="input-field"
              placeholder="ZIP Code or City"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={() => getCoordsFromZip(zip)}
              style={{ width: '100%' }}
              disabled={!zip || locLoading}
            >
              Check Route Safety
            </button>

            {locError && <p className="error-message">{locError}</p>}
          </div>
        ) : (
          <div className="overlay-content">
            {loading ? (
              <div className="glass-card status-indicator">
                <h2>Checking conditions...</h2>
                <div className="loader"></div>
              </div>
            ) : checked ? (
              alert ? (
                <ConstraintCard alert={alert} onReset={reset} />
              ) : (
                <div className="glass-card status-indicator">
                  <h2 className="all-clear">✅ No Active Constraints</h2>
                  <p className="subtitle">
                    Standard navigation assumptions hold for this area currently.
                  </p>
                  <button className="btn-primary" onClick={reset} style={{ width: '100%' }}>
                    Change Decision Context
                  </button>
                </div>
              )
            ) : null}
          </div>
        )}
      </MapOverlay>
    </div>
  );
}

export default App;
