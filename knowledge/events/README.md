# Event Knowledge Repository

This directory contains the canonical event definitions used by the Operational Decision Intelligence Platform.

## Purpose

The event repository defines every operational event that can be recognized by the decision engine.

## Event Domains

- Terrorism
- Conflict
- Crime
- Politics
- Cyber
- Weather
- Infrastructure
- Aviation
- Maritime
- Corporate
- Public Health

## Design Principles

- Events are independent of policies.
- Events do not contain business logic.
- Events are reusable across multiple policy domains.
- Every event has a unique identifier.
- Every event is version controlled.

## Future Contents

This directory will contain:

- `event.schema.json`
- `events.json`
- Domain-specific event definitions
- Validation metadata

These assets will serve as the foundation for the platform's decision engine.
