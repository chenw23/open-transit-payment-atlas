import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { systemFileSchema, type PaymentStatus, type TransitSystem } from "./schema";

const DATA_DIR = path.resolve("data/systems");

export function loadSystems(): TransitSystem[] {
  const files: string[] = fs
    .readdirSync(DATA_DIR)
    .filter((file: string) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .sort();

  const systems: TransitSystem[] = files.flatMap((file: string) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
    const parsed = YAML.parse(raw);
    return systemFileSchema.parse(parsed);
  });

  return systems.sort((a: TransitSystem, b: TransitSystem) =>
    [a.country, a.city, a.system].join("|").localeCompare(
      [b.country, b.city, b.system].join("|"),
    ),
  );
}

export const statusLabels: Record<PaymentStatus, string> = {
  yes: "Yes",
  partial: "Partial",
  planned: "Planned",
  no: "No",
  unknown: "Unknown",
  deprecated: "Deprecated",
};

export const statusMarks: Record<PaymentStatus, string> = {
  yes: "YES",
  partial: "PART",
  planned: "PLAN",
  no: "NO",
  unknown: "UNK",
  deprecated: "OLD",
};

export function methodText(status: PaymentStatus, values: string[] = []): string {
  const label = statusLabels[status];
  return values.length ? `${label}: ${values.join(", ")}` : label;
}

export function sourceByTitle(system: TransitSystem, title?: string) {
  if (!title) return undefined;
  return system.sources.find((source) => source.title === title);
}
