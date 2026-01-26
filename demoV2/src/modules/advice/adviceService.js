const adviceTemplates = {
    heat: {
        constraint: "Outdoor movement is no longer viable for pedestrian or strenuous travel.",
        reason: "Heat index levels exceed human safety thresholds for prolonged exposure.",
        timing: "Until sunset",
        avoid: ["Prolonged exposure", "Strenuous navigation"],
    },
    flood: {
        constraint: "Coastal roads and low-lying transit corridors are unavailable today.",
        reason: "Flood risk exceeds safe travel thresholds due to environmental conditions.",
        timing: "Until 6am tomorrow",
        avoid: ["Low-lying routes", "Coastal road navigation"],
    },
    air_quality: {
        constraint: "Normal navigation assumptions break in this area today; filtered transit only.",
        reason: "Atmospheric pollutant levels pose immediate respiratory risk.",
        timing: "During the next 12 hours",
        avoid: ["Open-air transit", "Unfiltered ventilation"],
    },
    weather: {
        constraint: "This route is not recommended to be used.",
        reason: "Extreme weather events have compromised standard safety margins.",
        timing: "After 10pm",
        avoid: ["Non-essential trips", "Routes with higher risk exposure"],
    },
    general: {
        constraint: "Standard decision-making for movement is suspended in this zone.",
        reason: "Active hazard data indicates that normal safety assumptions no longer hold.",
        timing: "Until further notice",
        avoid: ["Entering the restricted zone", "Standard routing"],
    }
};

export const generateAdvice = async (hazard) => {
    // In a real implementation, this would call an LLM API.
    // For the iteration, we use firm, declarative navigation-centric templates.
    const template = adviceTemplates[hazard.hazard_type] || adviceTemplates.general;

    return {
        title: `${hazard.event} Constraint`,
        constraint: template.constraint,
        reason: template.reason,
        avoid: template.avoid,
        type: hazard.hazard_type
    };
};
