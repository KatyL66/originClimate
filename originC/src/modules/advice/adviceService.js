const adviceTemplates = {
    heat: {
        avoid: ["Outdoor exercise", "Prolonged sun exposure"],
        recommended: ["Stay hydrated", "Use shaded or indoor spaces"],
        why: "Heat index levels significantly increase the risk of heat-related illness."
    },
    flood: {
        avoid: ["Driving through flooded roads", "Walking near streams or drainage channels"],
        recommended: ["Move to higher ground", "Monitor local news for evacuation orders"],
        why: "Rapidly rising water can trap you in low-lying areas or vehicles."
    },
    air_quality: {
        avoid: ["Outdoor strenuous activity", "Keeping windows open"],
        recommended: ["Use air purifiers", "Wear N95 masks if outdoors is necessary"],
        why: "High levels of pollutants can aggravate respiratory conditions."
    },
    weather: {
        avoid: ["Unnecessary travel", "Being near large trees or structures"],
        recommended: ["Stay indoors", "Secure loose outdoor items"],
        why: "Severe weather conditions pose significant safety risks."
    },
    general: {
        avoid: ["High-risk activities", "Ignoring authorities"],
        recommended: ["Stay informed", "Have an emergency kit ready"],
        why: "Active weather alerts indicate elevated risk in your area."
    }
};

export const generateAdvice = async (hazard) => {
    // In a real implementation, this would call an LLM API.
    // For the MVP, we use pre-defined high-quality templates.
    const template = adviceTemplates[hazard.hazard_type] || adviceTemplates.general;

    return {
        title: `${hazard.event} Alert`,
        avoid: template.avoid,
        recommended: template.recommended,
        why: template.why
    };
};
