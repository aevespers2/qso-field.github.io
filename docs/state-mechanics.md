# QSO State Mechanics

## 1. Purpose

This document turns the QSO Fabric variational hypergraph substrate into an actionable mechanics layer.

The goal is to define the conserved quantities, local update rules, entropy and repair operators, trust propagation rules, and minimum viable implementation contracts needed to move from architectural theory to executable substrate.

The guiding principle is:

> State persists, execution projects, transformations occur, and lineage remains auditable.

---

## 2. Core State Tuple

A QSO state at time `t` may be represented as:

```math
Q_i(t) = (I_i, X_i, M_i, G_i, P_i, R_i, T_i, \Pi_i, B_i)
```

where:

- `I_i` is the identity worldline.
- `X_i` is the current internal state payload.
- `M_i` is memory or historical trace.
- `G_i` is the goal vector.
- `P_i` is the policy and constraint set.
- `R_i` is the resource envelope.
- `T_i` is the trust vector.
- `\Pi_i` is the provenance chain.
- `B_i` is the future branch set.

The tuple is intentionally broader than a database record or process descriptor. It captures the full state-bearing identity of the computational object.

---

## 3. Conserved Quantities and Invariants

The fabric should maintain a small set of invariants under migration, projection, repair, and reconciliation.

### 3.1 Identity Continuity

A QSO may migrate or fork, but its lineage must remain traceable.

```math
I_i(t+1) = extend(I_i(t), event_t)
```

Invariant:

```text
No state transition may erase prior identity lineage.
```

### 3.2 Provenance Preservation

Every transformation must append a provenance record.

```math
\Pi_i(t+1) = \Pi_i(t) \cup \{record(f, input, output, actor, time, trust)\}
```

Invariant:

```text
Every accepted state transition must be replayable or explainable from provenance metadata.
```

### 3.3 Policy Non-Violation

A transition is admissible only if it satisfies local policy constraints.

```math
admissible(f,Q_i) \iff P_i(f,Q_i) = true
```

Invariant:

```text
Policy-violating transitions may be simulated, but may not be committed as canonical state.
```

### 3.4 Resource Boundedness

Runtime projection must occur within declared resource envelopes.

```math
cost(f,Q_i) \le R_i
```

Invariant:

```text
Execution may be denied, delayed, or delegated if the required resource cost exceeds the local envelope.
```

### 3.5 Trust Monotonicity Under Evidence

Trust should not change arbitrarily. It must update from evidence, provenance, or contradiction metrics.

```math
T_i(t+1)=g(T_i(t),E_i(t),S_i(t))
```

Invariant:

```text
Trust changes must be attributable to evidence or repair history.
```

---

## 4. Local Dynamics

A local QSO update is:

```math
Q_i(t+1)=D_i(Q_i(t),\mathcal N_i(t),O_i(t),A_i(t))
```

where:

- `\mathcal N_i(t)` is the local hypergraph neighborhood.
- `O_i(t)` is observation input.
- `A_i(t)` is the selected action or morphism.

Expanded:

```math
Q_i(t+1)=D_i(I_i,X_i,M_i,G_i,P_i,R_i,T_i,\Pi_i,B_i,\mathcal N_i,O_i,A_i)
```

The update process should follow this order:

```text
1. Observe local state and neighborhood.
2. Generate candidate morphisms.
3. Filter by policy.
4. Estimate resource cost.
5. Simulate candidate futures.
6. Score candidates using the variational objective.
7. Commit selected transition.
8. Append provenance.
9. Update trust and entropy.
10. Persist lineage.
```

---

## 5. Hypergraph Neighborhoods

A neighborhood is not limited to pairwise edges.

```math
\mathcal N_i(t)=\{e\in\mathcal H \mid i\in e\}
```

Each hyperedge may bind multiple QSOs:

```text
hyperedge :=
  participants
  relation type
  semantic weight
  policy constraints
  trust modifiers
  temporal validity
  provenance source
```

Example:

```text
User + Resource + Policy + Context
```

This hyperedge can express an access-control condition that pairwise edges would represent poorly.

---

## 6. Entropy and Contradiction

Local entropy measures inconsistency around a QSO and its neighborhood.

```math
S_i(t)=S(Q_i(t),\mathcal N_i(t))
```

A simple starting definition:

```math
S_i = \sum_k w_k c_k
```

where:

- `c_k` is a contradiction indicator or magnitude.
- `w_k` is the contradiction weight.

Contradiction classes may include:

```text
state mismatch
policy conflict
trust conflict
provenance gap
temporal inconsistency
goal incompatibility
resource overcommitment
semantic ambiguity
```

Global entropy is:

```math
S_{total}=\sum_i S_i
```

The MVP should compute local entropy first. Global entropy can be derived later.

---

## 7. Repair Operators

A repair operator attempts to reduce contradiction while preserving identity and provenance.

```math
\rho_i : (Q_i,\mathcal N_i) \rightarrow (Q_i',\mathcal N_i')
```

A repair is valid when:

```math
S_i(Q_i',\mathcal N_i') < S_i(Q_i,\mathcal N_i)
```

subject to:

```text
identity continuity
policy admissibility
resource boundedness
provenance preservation
trust attribution
```

Repair operators may include:

```text
merge branches
split conflicting state
mark uncertainty
request observation
downgrade trust
promote trusted source
roll back morphism
create alternate future branch
```

---

## 8. Trust Propagation

Trust evolves from evidence, provenance, and local entropy.

A minimal update rule:

```math
T_i(t+1)=clamp(T_i(t)+\eta E_i(t)-\mu S_i(t),0,1)
```

where:

- `E_i(t)` is evidence support.
- `S_i(t)` is contradiction entropy.
- `\eta` is evidence gain.
- `\mu` is entropy penalty.

Trust can also propagate across hyperedges:

```math
T_i^{neighbor}=\sum_{e\in\mathcal N_i} w_e T_e
```

The combined trust estimate may be:

```math
T_i(t+1)=clamp(aT_i(t)+bE_i(t)+cT_i^{neighbor}-dS_i(t),0,1)
```

The exact coefficients should be configurable per QSO genome or species.

---

## 9. Variational Selection

Candidate futures are scored by the fabric objective:

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

For each candidate branch:

```text
simulate branch
estimate resource cost
estimate entropy
estimate trust
estimate goal satisfaction
compute L(Q)
select best admissible branch
```

The canonical branch is the admissible branch with the lowest objective score, unless policy requires human or external review.

---

## 10. Runtime Projection Contract

A runtime projection is a temporary execution event.

```text
runtime_projection :=
  projection_id
  qso_id
  morphism_id
  input_state_hash
  required_capabilities
  resource_budget
  policy_context
  sandbox_type
  output_state_hash
  provenance_record
  trust_delta
  entropy_delta
```

Execution flow:

```text
1. QSO requests morphism.
2. Fabric selects runtime substrate.
3. Runtime receives state input and policy context.
4. Runtime executes morphism.
5. Output is hashed and validated.
6. Provenance is appended.
7. Runtime dissolves.
8. QSO persists updated state.
```

Suitable runtime targets include:

```text
WASM isolate
microVM
unikernel
container
serverless worker
local interpreter
remote trusted executor
```

---

## 11. Minimum Viable State Mechanics API

The first implementation should expose a small API surface.

```text
create_qso(spec) -> qso_id
read_qso(qso_id) -> QSO
attach_hyperedge(participants, relation) -> edge_id
propose_morphism(qso_id, morphism) -> candidate_id
simulate_candidate(candidate_id) -> branch_id
score_branch(branch_id) -> L_score
commit_branch(branch_id) -> qso_id
repair_qso(qso_id) -> repair_report
trace_lineage(qso_id) -> worldline
```

The MVP should be able to prove:

```text
A QSO can be created.
A QSO can attach to a semantic neighborhood.
A morphism can create a branch.
A branch can be scored.
A branch can be committed.
A provenance record is preserved.
Trust and entropy change after transition.
Lineage remains traceable.
```

---

## 12. Reference Package Layout

Recommended implementation layout:

```text
qso-core/
  qso_core/
    identity.py
    state.py
    hypergraph.py
    morphism.py
    entropy.py
    trust.py
    objective.py
    branch.py
    repair.py
    runtime_projection.py
    provenance.py
  tests/
    test_identity.py
    test_hypergraph.py
    test_morphism.py
    test_entropy.py
    test_trust.py
    test_objective.py
    test_branch.py
    test_repair.py
    test_runtime_projection.py
```

---

## 13. First Test Scenario

A minimal test scenario:

```text
1. Create User QSO.
2. Create Resource QSO.
3. Create Policy QSO.
4. Connect them with a hyperedge.
5. Propose an access morphism.
6. Simulate allow and deny branches.
7. Score both branches.
8. Commit the policy-admissible lowest-L branch.
9. Append provenance.
10. Update trust and entropy.
```

Expected result:

```text
The fabric chooses a state transition based on policy, trust, entropy, cost, and goal satisfaction rather than hard-coded procedural flow.
```

---

## 14. Next Implementation Milestone

The immediate next milestone is:

> Build a local-only QSO mechanics kernel that can create QSOs, connect them through hyperedges, apply morphisms, score candidate futures, and persist lineage.

This milestone does not require distributed networking, quantum infrastructure, AI models, or unikernels.

It only requires proving the central inversion:

```text
State requests execution.
Execution updates state.
State persists after execution dissolves.
```
