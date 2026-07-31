/**
 * MatchResult
 *
 * Standard response object returned by the
 * Normalization Engine.
 */

class MatchResult {

    constructor({

        input = null,

        canonical = null,

        matched = false,

        confidence = 0,

        method = "none",

        source = null,

        metadata = {}

    } = {}) {

        this.input = input;

        this.canonical = canonical;

        this.matched = matched;

        this.confidence = confidence;

        this.method = method;

        this.source = source;

        this.metadata = metadata;

        this.timestamp = new Date().toISOString();

    }

    //--------------------------------------------------------
    // EXACT MATCH
    //--------------------------------------------------------

    static exact(input, canonical, source) {

        return new MatchResult({

            input,

            canonical,

            matched: true,

            confidence: 100,

            method: "exact",

            source

        });

    }

    //--------------------------------------------------------
    // ALIAS MATCH
    //--------------------------------------------------------

    static alias(input, canonical, source) {

        return new MatchResult({

            input,

            canonical,

            matched: true,

            confidence: 98,

            method: "alias",

            source

        });

    }

    //--------------------------------------------------------
    // ABBREVIATION MATCH
    //--------------------------------------------------------

    static abbreviation(input, canonical, source) {

        return new MatchResult({

            input,

            canonical,

            matched: true,

            confidence: 96,

            method: "abbreviation",

            source

        });

    }

    //--------------------------------------------------------
    // MISSPELLING MATCH
    //--------------------------------------------------------

    static misspelling(input, canonical, source) {

        return new MatchResult({

            input,

            canonical,

            matched: true,

            confidence: 93,

            method: "misspelling",

            source

        });

    }

    //--------------------------------------------------------
    // FUZZY MATCH
    //--------------------------------------------------------

    static fuzzy(

        input,

        canonical,

        confidence,

        source

    ) {

        return new MatchResult({

            input,

            canonical,

            matched: true,

            confidence,

            method: "fuzzy",

            source,

            metadata: {

                fuzzy: true,

                threshold: 88

            }

        });

    }

    //--------------------------------------------------------
    // NO MATCH
    //--------------------------------------------------------

    static noMatch(input, source) {

        return new MatchResult({

            input,

            canonical: input,

            matched: false,

            confidence: 0,

            method: "none",

            source

        });

    }

    //--------------------------------------------------------
    // Convert to JSON
    //--------------------------------------------------------

    toJSON() {

        return {

            input: this.input,

            canonical: this.canonical,

            matched: this.matched,

            confidence: this.confidence,

            method: this.method,

            source: this.source,

            metadata: this.metadata,

            timestamp: this.timestamp

        };

    }

    //--------------------------------------------------------
    // Human-readable string
    //--------------------------------------------------------

    toString() {

        return `${this.input} -> ${this.canonical} (${this.method}, ${this.confidence}%)`;

    }

}

module.exports = MatchResult;