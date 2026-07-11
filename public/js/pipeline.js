/*
==========================================================
ODIP Pipeline Module
Sprint 2C
==========================================================
*/

const Pipeline = {

    currentStep: 0,

    setStep(step) {

        this.currentStep = step;

        console.log("Pipeline Step:", step);

    },

    next() {

        this.setStep(this.currentStep + 1);

    },

    previous() {

        this.setStep(Math.max(0, this.currentStep - 1));

    },

    reset() {

        this.setStep(0);

    }

};

console.log("✓ pipeline.js loaded");