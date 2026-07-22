import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import {
  busSystemFileSchema,
  systemFileSchema,
  type BusSystem,
  type PaymentStatus,
  type TransitSystem,
} from "./schema";

const DATA_DIR = path.resolve("data/systems");
const BUS_DATA_DIR = path.resolve("data/bus-systems");

function dataFiles(directory: string): string[] {
  return fs
    .readdirSync(directory)
    .filter((file: string) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .sort();
}

export function loadSystems(): TransitSystem[] {
  const systems: TransitSystem[] = dataFiles(DATA_DIR).flatMap((file: string) => {
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

export function loadBusSystems(): BusSystem[] {
  const systems: BusSystem[] = dataFiles(BUS_DATA_DIR).flatMap(
    (file: string) => {
      const raw = fs.readFileSync(path.join(BUS_DATA_DIR, file), "utf8");
      const parsed = YAML.parse(raw);
      return busSystemFileSchema.parse(parsed);
    },
  );

  return systems.sort((a: BusSystem, b: BusSystem) =>
    [a.country, a.city, a.network].join("|").localeCompare(
      [b.country, b.city, b.network].join("|"),
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
  yes: "✅",
  partial: "⭕",
  planned: "⏳",
  no: "",
  unknown: "?",
  deprecated: "❌",
};

export function methodText(status: PaymentStatus, values: string[] = []): string {
  const label = statusLabels[status];
  return values.length ? `${label}: ${values.join(", ")}` : label;
}

const schemeShortNames: Record<string, string> = {
  Visa: "V",
  Mastercard: "M",
  "American Express": "AE",
  Discover: "D",
  JCB: "J",
  UnionPay: "UP",
};

export function compactMethod(status: PaymentStatus): string {
  return statusMarks[status];
}

export function compactSchemes(status: PaymentStatus, schemes: string[] = []): string {
  const prefix = statusMarks[status];
  if (!prefix || !schemes.length) return prefix;
  return `${prefix}${schemes.map((scheme) => schemeShortNames[scheme] ?? scheme).join("/")}`;
}

export function sourceByTitle(
  system: Pick<TransitSystem | BusSystem, "sources">,
  title?: string,
) {
  if (!title) return undefined;
  return system.sources.find((source) => source.title === title);
}
