class DecisionContext {

    constructor(extraction = {}) {

        //==============================
        // Raw AI Extraction
        //==============================

        this.extraction = extraction;

        //==============================
        // Normalized Intelligence
        //==============================

        this.intelligence = {

            summary: extraction.summary || "",

            domain: extraction.domain || "",

            eventType: extraction.eventType || "",

            region: extraction.region || "",

            country: extraction.country || "",

            city: extraction.city || "",

            confidence: extraction.confidence || 0,

            casualties: extraction.casualties || {

                fatalities: 0,

                injuries: 0

            },

            crowdSize: extraction.crowdSize || 0,

            infrastructure:

                extraction.criticalInfrastructure || [],

            infrastructureImpact:

                extraction.infrastructureImpact || "None",

            threatIndicators:

                extraction.threatIndicators || [],

            weapons:

                extraction.weapons || [],

            organizations:

                extraction.organizations || [],

            persons:

                extraction.persons || []

        };

        //==============================
        // Risk Assessment
        //==============================

        this.riskFactors = [];

        this.riskScore = {

            total: 0,

            breakdown: []

        };

        //==============================
        // Operational Policies
        //==============================

        this.policies = [];

        //==============================
        // Threshold
        //==============================

        this.threshold = {

            level: "MONITOR",

            score: 0

        };

        //==============================
        // Highest Priority Event
        //==============================

        this.hpe = {

            isHPE: false,

            category: "",

            priority: ""

        };

        //==============================
        // Kinetic Assessment
        //==============================

        this.kinetic = {

            isKinetic: false

        };

        //==============================
        // Operational Workflow
        //==============================

        this.workflow = {

            priority: "",

            clientEscalation: false,

            booleanMonitoring: false,

            aiMonitoring: false,

            continuousMonitoring: false,

            shiftLead: false

        };

        //==============================
        // Recommendations
        //==============================

        this.recommendations = [];

        //==============================
        // SOP
        //==============================

        this.sop = {

            id: "",

            title: "",

            steps: []

        };

        //==============================
        // Explainability
        //==============================

        this.explanation = {

            summary: "",

            reasoning: []

        };

        //==============================
        // Audit Trail
        //==============================

        this.audit = [];

    }

}

module.exports = DecisionContext;