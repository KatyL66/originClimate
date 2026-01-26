export const fetchHazards = async (lat, lon) => {
    try {
        const response = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`);
        if (!response.ok) throw new Error('Failed to fetch hazard data');
        const data = await response.json();

        return data.features.map(feature => ({
            hazard_type: mapHazardType(feature.properties.event),
            severity: feature.properties.severity,
            start_time: feature.properties.effective,
            end_time: feature.properties.expires,
            raw_description: feature.properties.headline + ". " + (feature.properties.description || ""),
            event: feature.properties.event
        }));
    } catch (error) {
        console.error("Hazard fetch error:", error);
        return [];
    }
};

const mapHazardType = (event) => {
    const e = event.toLowerCase();
    if (e.includes('heat')) return 'heat';
    if (e.includes('flood')) return 'flood';
    if (e.includes('air')) return 'air_quality';
    if (e.includes('wind') || e.includes('storm')) return 'weather';
    return 'general';
};
