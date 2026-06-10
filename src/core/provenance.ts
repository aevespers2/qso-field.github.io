import { createHash } from "node:crypto";
import type { ProvenanceRecord, QSOObject } from "./qso-object.js";

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`)
    .join(",")}}`;
}

export function sha256(value: unknown): string {
  return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}

export interface CreateProvenanceInput {
  source: string;
  value?: unknown;
  description?: string;
  recordedAt?: string;
}

export function createProvenanceRecord(input: CreateProvenanceInput): ProvenanceRecord {
  return {
    source: input.source,
    hash: input.value === undefined ? undefined : sha256(input.value),
    recordedAt: input.recordedAt ?? new Date().toISOString(),
    ...(input.description ? { description: input.description } : {}),
  };
}

export function withProvenance<T extends QSOObject>(object: T, record: ProvenanceRecord): T {
  return {
    ...object,
    updatedAt: new Date().toISOString(),
    provenance: [...object.provenance, record],
  };
}
