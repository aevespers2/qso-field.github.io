export type JSONObject = Record<string, unknown>;

export interface Confidence {
  score: number;
  method: string;
  notes?: string;
}

export interface ProvenanceRecord {
  source: string;
  hash?: string;
  recordedAt: string;
  description?: string;
}

export interface RepairRecord {
  repairedAt: string;
  reason: string;
  method: string;
  previousHash?: string;
}

export interface SynchronizationState {
  sessionId?: string;
  sequence?: number;
  clock?: string;
}

export interface QSOObject<TState extends JSONObject = JSONObject> {
  qsoVersion: "0.1";
  objectId: string;
  objectType: string;
  createdAt: string;
  updatedAt: string;
  state: TState;
  confidence: Confidence;
  provenance: ProvenanceRecord[];
  repairHistory: RepairRecord[];
  synchronization: SynchronizationState;
  extensions: JSONObject;
}

export interface CreateQSOObjectInput<TState extends JSONObject = JSONObject> {
  objectId: string;
  objectType: string;
  state: TState;
  confidence?: Confidence;
  provenance?: ProvenanceRecord[];
  synchronization?: SynchronizationState;
  extensions?: JSONObject;
  now?: string;
}

export function createQSOObject<TState extends JSONObject>(input: CreateQSOObjectInput<TState>): QSOObject<TState> {
  const now = input.now ?? new Date().toISOString();

  return {
    qsoVersion: "0.1",
    objectId: input.objectId,
    objectType: input.objectType,
    createdAt: now,
    updatedAt: now,
    state: input.state,
    confidence: input.confidence ?? { score: 1, method: "declared" },
    provenance: input.provenance ?? [],
    repairHistory: [],
    synchronization: input.synchronization ?? {},
    extensions: input.extensions ?? {},
  };
}
