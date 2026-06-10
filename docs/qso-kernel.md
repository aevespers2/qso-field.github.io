# QSO Kernel Specification

## 1. Purpose

The QSO Kernel defines the canonical wire formats, ABI contracts, hashing rules, persistence rules, and execution interfaces required to implement the QSO Field as an actual state-oriented substrate.

The State Mechanics document defines the physics.

The QSO Kernel defines the machine contract.

```text
State Mechanics = laws of motion
QSO Kernel      = executable substrate contract
```

The kernel must make one principle concrete:

> Execution is an ephemeral projection. State is the durable primitive.

---

## 2. Kernel Responsibilities

The QSO Kernel is responsible for:

```text
QSO identity creation
canonical state encoding
worldline tracking
hyperedge representation
morphism registration
branch creation
branch scoring
provenance recording
trust and entropy deltas
runtime projection contracts
state hashing
state persistence
state replay
state migration
```

It is not responsible for:

```text
application UI
specific AI model behavior
specific database vendors
specific cloud providers
specific hardware targets
specific consensus protocols
```

Those are higher-level fabric concerns.

---

## 3. Canonical Kernel Object Types

The kernel recognizes the following canonical object types:

```text
QSO
Worldline
StateFrame
Hyperedge
Morphism
Branch
ProvenanceRecord
TrustVector
EntropyReport
RuntimeProjection
KernelEvent
```

Each object must be serializable, hashable, and replayable.

---

## 4. QSO Record Format

A QSO record is the durable identity envelope for a state-bearing entity.

```json
{
  "type": "qso",
  "kernel_version": "0.1.0",
  "qso_id": "qso_...",
  "worldline_id": "wl_...",
  "species": "generic",
  "genome": {},
  "current_state_hash": "sha256:...",
  "current_frame_id": "frame_...",
  "trust_vector_id": "trust_...",
  "policy_refs": [],
  "resource_envelope": {},
  "provenance_head": "prov_...",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601"
}
```

### Required fields

```text
type
kernel_version
qso_id
worldline_id
current_state_hash
current_frame_id
provenance_head
created_at
updated_at
```

### Identity rule

The `qso_id` identifies the durable entity.

The `worldline_id` identifies the continuity chain.

Forks may create new `qso_id` values while preserving a parent worldline reference.

---

## 5. QSO Identifier Format

A QSO identifier should be content-independent but provenance-bound.

Recommended format:

```text
qso_<base32(random_128_bits)>_<short_hash>
```

Example:

```text
qso_7K4M2N9Q8P1X3V6B_sha8d93af2
```

Rules:

```text
Identifiers must be globally unique.
Identifiers must not depend solely on mutable state.
Identifiers must be safe for URLs, filenames, and logs.
Identifiers must not encode private payload content.
```

---

## 6. Worldline Format

A worldline records identity continuity over time.

```json
{
  "type": "worldline",
  "worldline_id": "wl_...",
  "root_qso_id": "qso_...",
  "parent_worldline_id": null,
  "forked_from_frame_id": null,
  "events": [
    {
      "event_id": "evt_...",
      "event_type": "create",
      "frame_id": "frame_...",
      "timestamp": "ISO-8601",
      "provenance_id": "prov_..."
    }
  ]
}
```

Worldline event types:

```text
create
observe
morph
fork
merge
repair
migrate
project_runtime
commit_branch
reject_branch
archive
```

Invariant:

```text
No committed transition may remove or rewrite previous worldline events.
```

---

## 7. StateFrame Format

A StateFrame is an immutable snapshot of QSO state at a specific point in the worldline.

```json
{
  "type": "state_frame",
  "frame_id": "frame_...",
  "qso_id": "qso_...",
  "worldline_id": "wl_...",
  "sequence": 12,
  "payload": {},
  "memory_refs": [],
  "goal_vector": {},
  "policy_refs": [],
  "resource_state": {},
  "trust_vector_id": "trust_...",
  "entropy_report_id": "entropy_...",
  "previous_frame_hash": "sha256:...",
  "frame_hash": "sha256:...",
  "created_at": "ISO-8601"
}
```

Rules:

```text
StateFrames are immutable after creation.
Every StateFrame must hash its canonical serialized representation.
Every StateFrame except genesis must reference a previous frame hash.
Payload encoding must be deterministic.
```

---

## 8. Canonical Serialization

All kernel objects must serialize deterministically.

Minimum rules:

```text
UTF-8 encoding
sorted object keys
no insignificant whitespace
normalized ISO-8601 timestamps
explicit nulls for required nullable fields
arrays preserve order
numbers use canonical decimal representation
binary data is base64url encoded
```

Recommended canonical encoding path:

```text
object
  ↓
canonical JSON
  ↓
UTF-8 bytes
  ↓
SHA-256 hash
```

Future encodings may include CBOR, IPLD, Cap'n Proto, FlatBuffers, or Protocol Buffers, but JSON is the reference format for v0.1.

---

## 9. Hashing Rules

Every hash must declare its algorithm.

```text
sha256:<hex_digest>
blake3:<hex_digest>
```

Default:

```text
sha256
```

Hashable objects:

```text
StateFrame
Hyperedge
Morphism
Branch
ProvenanceRecord
RuntimeProjection
TrustVector
EntropyReport
```

Hashing rule:

```text
hash = SHA256(canonical_serialized_object_without_self_hash_field)
```

Self-referential hash fields must be excluded from the hash input.

---

## 10. Hyperedge Format

A hyperedge represents a higher-order semantic relation among QSOs.

```json
{
  "type": "hyperedge",
  "edge_id": "edge_...",
  "relation_type": "access_context",
  "participants": [
    {"role": "user", "qso_id": "qso_..."},
    {"role": "resource", "qso_id": "qso_..."},
    {"role": "policy", "qso_id": "qso_..."},
    {"role": "context", "qso_id": "qso_..."}
  ],
  "semantic_weight": 0.82,
  "trust_weight": 0.76,
  "policy_refs": [],
  "valid_from": "ISO-8601",
  "valid_until": null,
  "provenance_id": "prov_...",
  "edge_hash": "sha256:..."
}
```

Rules:

```text
A hyperedge must contain at least two participants.
Participant roles must be explicit.
Semantic weight must be normalized to [0,1] for v0.1.
Trust weight must be normalized to [0,1] for v0.1.
Temporal validity must be explicit.
```

---

## 11. Morphism Format

A morphism is an executable state transformation.

```json
{
  "type": "morphism",
  "morphism_id": "morph_...",
  "name": "grant_access",
  "version": "0.1.0",
  "input_schema": {},
  "output_schema": {},
  "policy_requirements": [],
  "resource_estimate": {},
  "runtime_requirements": {
    "sandbox": "wasm",
    "capabilities": []
  },
  "deterministic": true,
  "source_ref": null,
  "morphism_hash": "sha256:..."
}
```

Morphism classes:

```text
observe
transform
repair
fork
merge
score
project
migrate
archive
```

Rules:

```text
A morphism must declare input and output schemas.
A morphism must declare whether it is deterministic.
A morphism must declare runtime requirements.
A morphism must be hashable independently of any specific execution.
```

---

## 12. Morphism ABI

The minimum morphism ABI is:

```text
morphism(input_frame, context) -> output_frame_candidate
```

Canonical call envelope:

```json
{
  "morphism_id": "morph_...",
  "input_frame_id": "frame_...",
  "context": {
    "neighbor_refs": [],
    "hyperedge_refs": [],
    "policy_refs": [],
    "resource_budget": {},
    "trust_context": {},
    "entropy_context": {}
  }
}
```

Canonical result envelope:

```json
{
  "candidate_frame": {},
  "trust_delta": {},
  "entropy_delta": {},
  "resource_cost": {},
  "provenance_record": {},
  "logs_ref": null
}
```

A morphism does not directly mutate canonical state.

It returns a candidate.

The kernel decides whether to commit that candidate.

---

## 13. Branch Format

A branch represents a possible future state.

```json
{
  "type": "branch",
  "branch_id": "branch_...",
  "source_frame_id": "frame_...",
  "candidate_frame_id": "frame_...",
  "morphism_id": "morph_...",
  "probability": 0.64,
  "resource_cost": {},
  "entropy_score": 0.12,
  "trust_score": 0.88,
  "goal_score": 0.72,
  "objective_score": 0.31,
  "status": "candidate",
  "created_at": "ISO-8601"
}
```

Branch statuses:

```text
candidate
simulated
rejected
committed
archived
superseded
```

Rules:

```text
Branches are evaluated before commit.
Only committed branches advance canonical QSO state.
Rejected branches may be retained for audit, planning, and replay.
```

---

## 14. Objective ABI

The minimum objective function ABI is:

```text
score(branch, context) -> objective_score
```

Reference objective:

```math
\mathcal L(Q)
=
\lambda_EE(Q)
+
\lambda_SS(Q)
-
\lambda_TT(Q)
-
\lambda_GG(Q)
```

Reference JSON configuration:

```json
{
  "lambda_E": 1.0,
  "lambda_S": 1.0,
  "lambda_T": 1.0,
  "lambda_G": 1.0
}
```

The lowest admissible score is selected by default.

---

## 15. TrustVector Format

A TrustVector stores trust values and attribution.

```json
{
  "type": "trust_vector",
  "trust_vector_id": "trust_...",
  "qso_id": "qso_...",
  "overall": 0.81,
  "components": {
    "identity": 0.95,
    "provenance": 0.88,
    "source": 0.76,
    "consistency": 0.69,
    "runtime": 0.92
  },
  "evidence_refs": [],
  "updated_by": "morph_...",
  "created_at": "ISO-8601"
}
```

Rules:

```text
Trust values must be normalized to [0,1] in v0.1.
Trust updates must reference evidence, provenance, entropy change, or runtime behavior.
Trust changes must not be silent.
```

---

## 16. EntropyReport Format

An EntropyReport records contradiction and inconsistency metrics.

```json
{
  "type": "entropy_report",
  "entropy_report_id": "entropy_...",
  "qso_id": "qso_...",
  "local_entropy": 0.18,
  "contradictions": [
    {
      "class": "policy_conflict",
      "severity": 0.4,
      "description": "Candidate transition conflicts with local access policy.",
      "refs": []
    }
  ],
  "created_at": "ISO-8601"
}
```

Contradiction classes:

```text
state_mismatch
policy_conflict
trust_conflict
provenance_gap
temporal_inconsistency
goal_incompatibility
resource_overcommitment
semantic_ambiguity
```

---

## 17. ProvenanceRecord Format

A ProvenanceRecord explains how a state transition was produced.

```json
{
  "type": "provenance_record",
  "provenance_id": "prov_...",
  "qso_id": "qso_...",
  "event_type": "morph",
  "input_frame_hash": "sha256:...",
  "output_frame_hash": "sha256:...",
  "morphism_id": "morph_...",
  "runtime_projection_id": "proj_...",
  "actor": "kernel",
  "timestamp": "ISO-8601",
  "signature": null,
  "previous_provenance_hash": "sha256:...",
  "provenance_hash": "sha256:..."
}
```

Rules:

```text
Every committed state transition must create a ProvenanceRecord.
Provenance records form a hash-linked chain.
External signatures may be added later.
Unsigned provenance is allowed in v0.1 but must be explicit.
```

---

## 18. RuntimeProjection Format

A RuntimeProjection is a temporary execution environment request and result.

```json
{
  "type": "runtime_projection",
  "runtime_projection_id": "proj_...",
  "qso_id": "qso_...",
  "morphism_id": "morph_...",
  "sandbox_type": "wasm",
  "required_capabilities": [],
  "resource_budget": {},
  "input_state_hash": "sha256:...",
  "output_state_hash": "sha256:...",
  "started_at": "ISO-8601",
  "finished_at": "ISO-8601",
  "exit_status": "success",
  "logs_ref": null,
  "projection_hash": "sha256:..."
}
```

Exit statuses:

```text
success
policy_denied
resource_denied
runtime_error
timeout
invalid_output
rejected
```

Rule:

```text
A runtime projection may produce a candidate state, but it may not commit canonical state by itself.
```

---

## 19. Kernel Event Log

Every kernel action emits a KernelEvent.

```json
{
  "type": "kernel_event",
  "event_id": "evt_...",
  "event_type": "commit_branch",
  "qso_id": "qso_...",
  "refs": [],
  "timestamp": "ISO-8601",
  "event_hash": "sha256:..."
}
```

Kernel event types:

```text
create_qso
create_frame
create_hyperedge
register_morphism
project_runtime
create_branch
score_branch
commit_branch
reject_branch
repair_qso
merge_branch
fork_qso
migrate_qso
archive_qso
```

---

## 20. Persistence Rules

The kernel persistence layer must support:

```text
append-only event log
content-addressed state frames
current-head pointer per QSO
worldline lookup
provenance lookup
branch lookup
hyperedge lookup
morphism registry lookup
```

Minimum storage collections:

```text
qsos
worldlines
frames
hyperedges
morphisms
branches
trust_vectors
entropy_reports
provenance_records
runtime_projections
kernel_events
```

Canonical current state is determined by:

```text
QSO.current_frame_id
```

not by mutable payload replacement.

---

## 21. Replay Rules

A QSO must be replayable from genesis state plus committed events.

Replay process:

```text
1. Load root QSO.
2. Load worldline events in sequence order.
3. Load each committed StateFrame.
4. Verify hashes.
5. Verify provenance chain.
6. Reconstruct current head.
7. Compare reconstructed head to QSO.current_frame_id.
```

Replay failure classes:

```text
missing_frame
hash_mismatch
broken_worldline
broken_provenance
invalid_sequence
policy_replay_failure
```

---

## 22. Migration Rules

QSO migration transfers state without destroying identity continuity.

Migration record must include:

```text
source_node
target_node
qso_id
current_frame_hash
provenance_head
migration_morphism_id
verification_result
```

Rule:

```text
A migrated QSO keeps its qso_id and worldline_id unless the operation is explicitly a fork.
```

---

## 23. Security Rules

Minimum v0.1 security rules:

```text
No transition without provenance.
No runtime projection without declared capabilities.
No commit without policy check.
No state frame without hash.
No trust update without attribution.
No branch commit without source frame reference.
No migration without verification record.
```

Future versions should add:

```text
object signatures
capability tokens
encrypted payload fields
zero-knowledge policy proofs
remote attestation
secure enclave support
threshold commit approval
```

---

## 24. Minimum Kernel API

The kernel must expose the following operations:

```text
create_qso(spec) -> qso
read_qso(qso_id) -> qso
create_state_frame(qso_id, payload) -> state_frame
attach_hyperedge(relation) -> hyperedge
register_morphism(spec) -> morphism
project_runtime(request) -> runtime_projection
propose_branch(request) -> branch
score_branch(branch_id) -> branch
commit_branch(branch_id) -> qso
reject_branch(branch_id, reason) -> branch
create_trust_vector(qso_id, components) -> trust_vector
create_entropy_report(qso_id, contradictions) -> entropy_report
append_provenance(record) -> provenance_record
trace_worldline(qso_id) -> worldline
replay_qso(qso_id) -> replay_report
migrate_qso(qso_id, target) -> migration_report
```

---

## 25. Minimum Test Matrix

The first kernel implementation must pass these tests:

```text
Create QSO with genesis frame.
Hash StateFrame deterministically.
Append worldline event.
Attach hyperedge with four participants.
Register deterministic morphism.
Project runtime for morphism.
Produce candidate branch.
Score candidate branch.
Reject policy-violating branch.
Commit admissible branch.
Append provenance record.
Update trust vector.
Create entropy report.
Replay QSO from worldline.
Detect hash mismatch.
Fork QSO into child worldline.
Verify migration preserves identity.
```

---

## 26. Reference Implementation Target

The first implementation should be local-only and file-backed.

Recommended target:

```text
Python 3.12+
canonical JSON
SHA-256
append-only JSONL event log
content-addressed frame directory
pytest test suite
```

Initial package layout:

```text
qso-core/
  qso_core/
    ids.py
    canonical.py
    hashes.py
    qso.py
    worldline.py
    frame.py
    hyperedge.py
    morphism.py
    branch.py
    objective.py
    trust.py
    entropy.py
    provenance.py
    runtime.py
    eventlog.py
    replay.py
    migration.py
  tests/
```

---

## 27. Versioning

Kernel versions follow semantic versioning.

```text
0.1.0 = local-only reference kernel
0.2.0 = runtime projection adapters
0.3.0 = branch and repair planner
0.4.0 = distributed migration
0.5.0 = signed provenance
1.0.0 = stable ABI
```

Objects must include:

```text
kernel_version
```

so future readers can interpret old state correctly.

---

## 28. Immediate Next Build Step

The immediate next build step is to create the local reference package:

```text
qso-core/
```

with enough implementation to run the first scenario:

```text
User QSO
Resource QSO
Policy QSO
Context QSO
Hyperedge connecting all four
Access morphism
Allow branch
Deny branch
Objective score
Commit selected branch
Replay lineage
```

This proves the QSO inversion in executable form:

```text
Persistent state requests execution.
Runtime projects temporarily.
Candidate futures are scored.
One branch is committed.
Lineage persists.
```
