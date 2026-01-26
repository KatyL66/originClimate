/**
 * Fetches routing data between two points using OSRM.
 * @param {Object} origin - { latitude, longitude }
 * @param {Object} destination - { latitude, longitude }
 * @returns {Promise<Array>} - Array of route objects including geometry
 */
export const fetchRoutes = async (origin, destination) => {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&alternatives=true`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch routes');
        
        const data = await response.json();
        
        if (data.code !== 'Ok') throw new Error(data.message || 'Route not found');
        
        return data.routes.map((route, index) => ({
            id: `route-${index}`,
            geometry: route.geometry,
            distance: route.distance,
            duration: route.duration,
            weight: route.weight
        }));
    } catch (error) {
        console.error("Routing error:", error);
        throw error;
    }
};
