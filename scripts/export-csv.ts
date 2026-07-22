import fs from "node:fs";
import { loadBusSystems, loadSystems } from "../src/lib/data";

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const systems = loadSystems();
const headers = [
  "id",
  "country",
  "city",
  "system",
  "operator",
  "gate_transit_card",
  "gate_bank_card",
  "gate_bank_card_schemes",
  "gate_mobile_wallet",
  "gate_qr",
  "tvm_cash",
  "tvm_bank_card",
  "open_loop",
  "last_verified",
];

const rows = systems.map((system) => [
  system.id,
  system.country,
  system.city,
  system.system,
  system.operator,
  system.payment.gate_entry.local_transit_card.status,
  system.payment.gate_entry.contactless_bank_card.status,
  system.payment.gate_entry.contactless_bank_card.schemes.join(";"),
  system.payment.gate_entry.mobile_wallet.status,
  system.payment.gate_entry.qr_code.status,
  system.payment.ticket_machine.cash.status,
  system.payment.ticket_machine.bank_card.status,
  system.interoperability.open_loop,
  system.last_verified,
]);

fs.mkdirSync("dist-data", { recursive: true });
fs.writeFileSync(
  "dist-data/systems.csv",
  `${[headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n")}\n`,
);
fs.writeFileSync("dist-data/systems.json", `${JSON.stringify(systems, null, 2)}\n`);

const busSystems = loadBusSystems();
const busHeaders = [
  "id",
  "country",
  "city",
  "network",
  "operator",
  "cash",
  "transit_card",
  "bank_card",
  "bank_card_schemes",
  "mobile_wallet",
  "qr_code",
  "official_app",
  "exit_validation",
  "last_verified",
];
const busRows = busSystems.map((system) => [
  system.id,
  system.country,
  system.city,
  system.network,
  system.operator,
  system.payment.cash.status,
  system.payment.transit_card.status,
  system.payment.contactless_bank_card.status,
  system.payment.contactless_bank_card.schemes.join(";"),
  system.payment.mobile_wallet.status,
  system.payment.qr_code.status,
  system.payment.official_app.status,
  system.exit_validation,
  system.last_verified,
]);

fs.writeFileSync(
  "dist-data/bus-systems.csv",
  `${[busHeaders, ...busRows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n")}\n`,
);
fs.writeFileSync(
  "dist-data/bus-systems.json",
  `${JSON.stringify(busSystems, null, 2)}\n`,
);

console.log(
  `Exported ${systems.length} rail and ${busSystems.length} bus systems to dist-data/.`,
);
