class EntityExtractor {

    extract(data) {

        const entities = [];

        this.add(entities, "Country", data.country);
        this.add(entities, "Region", data.region);
        this.add(entities, "Location", data.location);
        this.add(entities, "EventType", data.eventType);

        if (Array.isArray(data.weapons)) {

            data.weapons.forEach(w =>
                this.add(entities, "Weapon", w)
            );

        }

        if (Array.isArray(data.criticalInfrastructure)) {

            data.criticalInfrastructure.forEach(i =>
                this.add(entities, "Infrastructure", i)
            );

        }

        if (Array.isArray(data.entities)) {

            data.entities.forEach(e =>
                this.add(entities, "Entity", e)
            );

        }

        return entities;

    }

    add(collection, type, value) {

        if (!value) return;

        collection.push({

            type,
            value

        });

    }

}

module.exports = EntityExtractor;