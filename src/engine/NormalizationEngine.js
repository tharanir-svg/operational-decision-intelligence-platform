class NormalizationEngine {

    constructor() {

        this.eventMap = {

            "terrorist_attack": "Terrorist Attack",
            "terror attack": "Terrorist Attack",
            "terrorism": "Terrorist Attack",
            "bomb blast": "Terrorist Attack",
            "bombing": "Terrorist Attack",

            "cyber_attack": "Cyber Attack",
            "cyber attack": "Cyber Attack",
            "ransomware": "Cyber Attack",
            "malware": "Cyber Attack",

            "earthquake": "Earthquake",
            "quake": "Earthquake",
            "seismic event": "Earthquake",

            "crowd_incident": "Crowd Incident",
            "crowd incident": "Crowd Incident",
            "stampede": "Crowd Incident"

        };

    }

    normalize(eventContext) {

        const normalized = { ...eventContext };

        if (normalized.eventType) {

            const key = normalized.eventType
                .toLowerCase()
                .trim();

            normalized.originalEventType =
                normalized.eventType;

            normalized.eventType =
                this.eventMap[key] ||
                normalized.eventType;

        }

        return normalized;

    }

}

module.exports = NormalizationEngine;