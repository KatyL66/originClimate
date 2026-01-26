import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map view when location changes
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

const MapOverlay = ({ children, isRestricted, loading, location, routes = [], selectedRouteId, onRouteClick }) => {
    const mapCenter = location ? [location.latitude, location.longitude] : [34.0522, -118.2437]; // Default LA

    return (
        <div className="map-container-mock">
            {/* Real Map Background */}
            <div className="map-background">
                <MapContainer
                    center={mapCenter}
                    zoom={11}
                    zoomControl={false}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {location && <Marker position={mapCenter} />}

                    {routes.map((route) => (
                        <Polyline
                            key={route.id}
                            positions={route.geometry.coordinates.map(coord => [coord[1], coord[0]])}
                            pathOptions={{
                                color: route.id === selectedRouteId ? '#6366f1' : '#94a3b8',
                                weight: route.id === selectedRouteId ? 6 : 4,
                                opacity: route.id === selectedRouteId ? 1 : 0.6,
                                lineJoin: 'round'
                            }}
                            eventHandlers={{
                                click: () => onRouteClick && onRouteClick(route.id)
                            }}
                        />
                    ))}

                    <ChangeView center={mapCenter} />
                </MapContainer>
                {isRestricted && <div className="hazard-overlay-layer"></div>}
            </div>

            {/* Plugin UI Layer */}
            <div className="overlay-ui">
                {isRestricted && !loading && (
                    <div className="reality-check-banner">
                        <span className="banner-icon">🚫</span>
                        <div className="banner-text">
                            <strong>Navigation Reality Check</strong>
                            <p>Normal navigation does not apply in this area today.</p>
                        </div>
                    </div>
                )}

                <div className="content-layer">
                    {children}
                </div>

                <div className="plugin-footer">
                    <p>origin prompt C v2.0</p>
                    <p className="footer-note">(try to drag the map here)</p>
                </div>
            </div>
        </div>
    );
};

export default MapOverlay;
