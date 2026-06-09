# State Router

## Purpose

The State Router is the control plane responsible for moving, synchronizing, and reconciling state across the network.

Traditional routers make forwarding decisions using destination, latency, cost, and policy.

A QSO State Router additionally considers:

- provenance
- confidence
- synchronization status
- repair history
- trust metadata
- route quality

## Core Functions

### State Movement

Move state between nodes while preserving metadata.

### Session Registry

Track state exchange sessions.

### Route Scoring

Evaluate routes using:

```text
coherence
availability
latency
trust
repair cost
```

### Observability

Expose telemetry describing state transitions.

## State Envelope

A state envelope may contain:

- object identifier
- provenance references
- confidence score
- timestamps
- repair records
- synchronization markers

## Compatibility

The router operates over existing transports:

- QUIC
- IPv6
- WireGuard
- MQTT
- NATS
- Kafka

## Design Goal

The State Router should function on existing packet networks without requiring specialized hardware.
