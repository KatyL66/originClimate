import React, { useState, useEffect } from 'react';
import { useLocation } from './modules/location/useLocation';
import { fetchHazards } from './modules/hazard/hazardService';
import { checkTrigger } from './modules/logic/triggerLogic';
import { generateAdvice } from './modules/advice/adviceService';
import { fetchRoutes } from './modules/location/routingService';
import MapOverlay from './components/MapOverlay';
import ConstraintCard from './components/ConstraintCard';
import './index.css';

function App() {
  const { location, loading: locLoading, error: locError, getGPSLocation, getCoordsFromZip, clearLocation } = useLocation();
  const [zip, setZip] = useState('');
  const [mode, setMode] = useState('single'); // 'single' or 'route'
  const [originZip, setOriginZip] = useState('');
  const [destinationZip, setDestinationZip] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [routeSelectionPending, setRouteSelectionPending] = useState(false);

  useEffect(() => {
    if (location && mode === 'single') {
      handleCheckHazards();
    }
  }, [location, mode]);

  const handleCheckHazards = async () => {
    if (!location) return;
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

  const handleFindRoutes = async () => {
    if (!originZip || !destinationZip) return;
    setLoading(true);
    setChecked(false);
    setAlert(null);
    try {
      const originCoords = await getCoordsFromZip(originZip);
      const destCoords = await getCoordsFromZip(destinationZip);
      const fetchedRoutes = await fetchRoutes(originCoords, destCoords);
      setRoutes(fetchedRoutes);
      setRouteSelectionPending(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = async (routeId) => {
    setSelectedRouteId(routeId);
    setRouteSelectionPending(false);
    const selectedRoute = routes.find(r => r.id === routeId);
    if (!selectedRoute) return;

    setLoading(true);
    setChecked(false);
    setAlert(null);

    // Sample points along the route (approx 10 points)
    const coords = selectedRoute.geometry.coordinates;
    const sampleSize = 10;
    const step = Math.max(1, Math.floor(coords.length / sampleSize));
    const sampledPoints = [];
    for (let i = 0; i < coords.length; i += step) {
      sampledPoints.push(coords[i]);
    }
    // Ensure the last point is included
    if (sampledPoints[sampledPoints.length - 1] !== coords[coords.length - 1]) {
      sampledPoints.push(coords[coords.length - 1]);
    }

    let foundHazard = null;
    for (const point of sampledPoints) {
      const data = await fetchHazards(point[1], point[0]);
      const { trigger_alert, alerts } = checkTrigger(data);
      if (trigger_alert) {
        foundHazard = alerts[0];
        break;
      }
    }

    if (foundHazard) {
      const advice = await generateAdvice(foundHazard);
      setAlert({
        ...advice,
        title: `Route ${advice.title}`,
        constraint: `This selected route is unavailable. ${advice.constraint}`
      });
    } else {
      setAlert(null);
    }

    setLoading(false);
    setChecked(true);
  };

  const reset = () => {
    setAlert(null);
    setChecked(false);
    setRouteSelectionPending(false);
    setZip('');
    setOriginZip('');
    setDestinationZip('');
    setRoutes([]);
    setSelectedRouteId(null);
    clearLocation();
  };

  const changeMode = (newMode) => {
    reset();
    setMode(newMode);
  };

  return (
    <div className="app-container">
      <MapOverlay
        isRestricted={!!alert}
        loading={loading}
        location={location}
        routes={routes}
        selectedRouteId={selectedRouteId}
        onRouteClick={handleRouteSelect}
      >
        {!location && routes.length === 0 ? (
          <div className="glass-card context-selector">
            <h1>Where are you heading?</h1>

            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'single' ? 'active' : ''}`}
                onClick={() => changeMode('single')}
              >
                Single Point
              </button>
              <button
                className={`mode-btn ${mode === 'route' ? 'active' : ''}`}
                onClick={() => changeMode('route')}
              >
                Route Evaluation
              </button>
            </div>

            {mode === 'single' ? (
              <>
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
              </>
            ) : (
              <>
                <p className="subtitle">
                  Enter origin and destination to evaluate common driving routes for climate constraints.
                </p>

                <div className="route-inputs">
                  <div className="input-group">
                    <span className="input-label">From</span>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Origin ZIP"
                      value={originZip}
                      onChange={(e) => setOriginZip(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <span className="input-label">To</span>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Dest ZIP"
                      value={destinationZip}
                      onChange={(e) => setDestinationZip(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleFindRoutes}
                  style={{ width: '100%' }}
                  disabled={!originZip || !destinationZip || loading}
                >
                  {loading ? 'Fetching Routes...' : 'Find Routes'}
                </button>
              </>
            )}

            {locError && <p className="error-message">{locError}</p>}
          </div>
        ) : (
          <div className="overlay-content">
            {loading ? (
              <div className="glass-card status-indicator">
                <h2>{mode === 'route' && selectedRouteId ? 'Evaluating route...' : 'Checking conditions...'}</h2>
                <div className="loader"></div>
              </div>
            ) : checked && !routeSelectionPending ? (
              alert ? (
                <ConstraintCard alert={alert} onReset={reset} />
              ) : (
                <div className="glass-card status-indicator">
                  <h2 className="all-clear">✅ {mode === 'route' ? 'Route Viable' : 'No Active Constraints'}</h2>
                  <p className="subtitle">
                    {mode === 'route'
                      ? 'No significant climate hazards detected along this specific route segment.'
                      : 'Standard navigation assumptions hold for this area currently.'}
                  </p>
                  <button className="btn-primary" onClick={reset} style={{ width: '100%' }}>
                    Change Decision Context
                  </button>
                </div>
              )
            ) : mode === 'route' && routeSelectionPending ? (
              <div className="glass-card status-indicator">
                <h2>Select a route on the map</h2>
                <p className="subtitle">
                  We found {routes.length} common routes. Click one to evaluate climate constraints.
                </p>
                <button className="btn-secondary" onClick={reset}>
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        )}
      </MapOverlay>
    </div>
  );
}

export default App;
