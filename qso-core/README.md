# qso-core

`qso-core` is the local reference implementation of the QSO Kernel v0.1.

It proves the core inversion:

```text
Persistent state requests execution.
Runtime projects temporarily.
Candidate futures are scored.
One branch is committed.
Lineage persists.
```

## Initial scope

This package is intentionally local-only and file-backed-ready. It provides:

- canonical JSON serialization,
- SHA-256 hashing,
- QSO identifiers,
- immutable state frames,
- worldline events,
- hyperedges,
- morphisms,
- branches,
- provenance records,
- trust vectors,
- entropy reports,
- runtime projection records,
- replay-ready event structures.

## First demo scenario

```text
User QSO
Resource QSO
Policy QSO
Context QSO

↓

Hyperedge

↓

Access Morphism

↓

Allow Branch / Deny Branch

↓

Objective Evaluation

↓

Commit Winning Branch

↓

Replay Worldline
```

## Status

This is the first scaffold. It is designed to be expanded into a real package with tests and persistence adapters.
