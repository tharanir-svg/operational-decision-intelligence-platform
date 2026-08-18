# ADR-001 : Canonical Knowledge Base

Status

Accepted

Date

2026-07-24

## Context

The platform currently stores operational knowledge across multiple JSON files.

As the platform expands, maintaining multiple disconnected files becomes increasingly difficult.

## Decision

Create a canonical taxonomy.

knowledge/

taxonomy/

domains.json

regions.json

countries.json

event-types.json

threat-actors.json

critical-sectors.json

## Consequences

Positive

- Single source of truth
- Easier maintenance
- Dynamic dropdowns
- Version control

Negative

- Requires migration
- Requires frontend updates
