# QSO Object Schema v0.1

## Purpose

The QSO object is the core unit of state in QSO Field.

A QSO object carries not only payload data, but also metadata describing identity, provenance, confidence, synchronization, and repair history.

## Conceptual Shape

```json
{
  "qso_version": "0.1",
  "object_id": "qso:example:001",
  "object_type": "state.record",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "state": {},
  "confidence": {
    "score": 0.95,
    "method": "declared"
  },
  "provenance": [],
  "repair_history": [],
  "synchronization": {},
  "extensions": {}
}
```

## Required Fields

### `qso_version`

Schema version.

### `object_id`

Globally unique object identifier.

### `object_type`

Object category.

### `state`

The current state payload.

### `created_at`

Creation timestamp.

### `updated_at`

Most recent update timestamp.

## Recommended Fields

### `confidence`

Represents uncertainty, trust, or quality of a state claim.

### `provenance`

References source records, signatures, hashes, custody events, or upstream objects.

### `repair_history`

Tracks reconciliation, correction, conflict resolution, or restoration events.

### `synchronization`

Tracks clocks, ordering, session identifiers, and replication state.

### `extensions`

Allows domain-specific metadata without changing the base schema.

## Design Requirements

The schema should be:

- human-readable
- machine-parseable
- versioned
- extensible
- provenance-preserving
- suitable for validators

## Open Questions

- Which fields should be mandatory in v1.0?
- How should confidence be normalized?
- How should contradictory states be represented?
- Which signature formats should be supported first?
