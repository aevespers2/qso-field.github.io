# SDK Catalog

## Purpose

The SDK catalog defines the expected developer-facing interfaces for QSO Field.

The goal is interoperability before implementation.

## Core SDK Areas

### Object SDK

Responsibilities:

- create QSO objects
- validate schemas
- manage provenance metadata
- manage confidence metadata

### Router SDK

Responsibilities:

- create sessions
- publish state
- subscribe to state
- inspect routing telemetry

### Provenance SDK

Responsibilities:

- hashing
- signatures
- custody chains
- verification workflows

### Agent SDK

Responsibilities:

- identity
- memory state
- tool-call records
- state updates

### Validator SDK

Responsibilities:

- state verification
- provenance verification
- repair verification
- availability verification

## Language Targets

Potential targets:

- TypeScript
- Python
- Go
- Rust
- Julia

## Design Principles

SDKs should be:

- simple
- versioned
- well documented
- transport-agnostic
- compatible across repositories

## Deliverables

Future versions should define:

- API specifications
- event formats
- example applications
- reference implementations
