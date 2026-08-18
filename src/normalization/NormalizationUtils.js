class NormalizationUtils {

    static normalize(text) {

        if (!text)
            return "";

        return text
            .toString()
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ");

    }

    static equals(a, b) {

        return this.normalize(a) === this.normalize(b);

    }

    static tokenize(text) {

        return this.normalize(text)
            .split(" ")
            .filter(Boolean);

    }

}

module.exports = NormalizationUtils;