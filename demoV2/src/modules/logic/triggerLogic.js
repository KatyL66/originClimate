const HEAT_THRESHOLD_SEVERITY = ['Severe', 'Extreme'];
const FLOOD_THRESHOLD_TYPES = ['Flood Warning', 'Flash Flood Warning', 'Flood Watch'];

export const checkTrigger = (hazards) => {
    if (!hazards || hazards.length === 0) return { trigger_alert: false };

    const activeAlerts = hazards.filter(hazard => {
        if (hazard.hazard_type === 'heat' && HEAT_THRESHOLD_SEVERITY.includes(hazard.severity)) {
            return true;
        }
        if (hazard.hazard_type === 'flood' && FLOOD_THRESHOLD_TYPES.some(t => hazard.event.includes(t))) {
            return true;
        }
        // General fallback for any severe/extreme alert
        if (['Severe', 'Extreme'].includes(hazard.severity)) {
            return true;
        }
        return false;
    });

    return {
        trigger_alert: activeAlerts.length > 0,
        alerts: activeAlerts
    };
};
