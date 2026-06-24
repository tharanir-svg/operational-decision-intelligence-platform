class EventIngestionService {
  validate(event) {
    if (!event.eventType) {
      throw new Error("eventType required");
    }

    if (!event.region) {
      throw new Error("region required");
    }

    return true;
  }

  normalize(event) {
    return {
      ...event,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = EventIngestionService;
