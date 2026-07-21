import { loadSystems } from "../src/lib/data";
import type { PaymentMethod, TransitSystem } from "../src/lib/schema";

const sourceRequiredStatuses = new Set(["yes", "partial", "planned", "deprecated"]);

function methodsFor(system: TransitSystem): Array<[string, PaymentMethod]> {
  return [
    ["gate_entry.local_transit_card", system.payment.gate_entry.local_transit_card],
    ["gate_entry.contactless_bank_card", system.payment.gate_entry.contactless_bank_card],
    ["gate_entry.mobile_wallet", system.payment.gate_entry.mobile_wallet],
    ["gate_entry.qr_code", system.payment.gate_entry.qr_code],
    ["gate_entry.official_app", system.payment.gate_entry.official_app],
    ["gate_entry.paper_or_token", system.payment.gate_entry.paper_or_token],
    ["gate_entry.tourist_pass", system.payment.gate_entry.tourist_pass],
    ["ticket_machine.cash", system.payment.ticket_machine.cash],
    ["ticket_machine.bank_card", system.payment.ticket_machine.bank_card],
    ["ticket_machine.contactless_card", system.payment.ticket_machine.contactless_card],
    ["ticket_machine.mobile_wallet", system.payment.ticket_machine.mobile_wallet],
    ["ticket_machine.qr_payment", system.payment.ticket_machine.qr_payment],
  ];
}

const systems = loadSystems();
const ids = new Set<string>();
const errors: string[] = [];

const defaultedMethodFields: Array<
  [string, (system: TransitSystem) => PaymentMethod]
> = [
  ["gate_entry.local_transit_card", (system) => system.payment.gate_entry.local_transit_card],
  ["gate_entry.contactless_bank_card", (system) => system.payment.gate_entry.contactless_bank_card],
  ["gate_entry.mobile_wallet", (system) => system.payment.gate_entry.mobile_wallet],
  ["gate_entry.qr_code", (system) => system.payment.gate_entry.qr_code],
  ["gate_entry.official_app", (system) => system.payment.gate_entry.official_app],
  ["gate_entry.paper_or_token", (system) => system.payment.gate_entry.paper_or_token],
  ["gate_entry.tourist_pass", (system) => system.payment.gate_entry.tourist_pass],
  ["ticket_machine.cash", (system) => system.payment.ticket_machine.cash],
  ["ticket_machine.bank_card", (system) => system.payment.ticket_machine.bank_card],
  ["ticket_machine.contactless_card", (system) => system.payment.ticket_machine.contactless_card],
  ["ticket_machine.mobile_wallet", (system) => system.payment.ticket_machine.mobile_wallet],
  ["ticket_machine.qr_payment", (system) => system.payment.ticket_machine.qr_payment],
];

for (const system of systems) {
  if (ids.has(system.id)) {
    errors.push(`Duplicate system id: ${system.id}`);
  }
  ids.add(system.id);

  if (system.country.trim().toLowerCase() === "china") {
    errors.push(
      `${system.id} is in mainland China, which is maintained by CNRT rather than this atlas`,
    );
  }

  const sourceTitles = new Set(system.sources.map((source) => source.title));
  for (const [field, getMethod] of defaultedMethodFields) {
    const method = getMethod(system);
    if (!method || !method.status) {
      errors.push(`${system.id}.${field} was not defaulted to a complete method`);
    }
  }
  for (const [field, method] of methodsFor(system)) {
    if (method.source && !sourceTitles.has(method.source)) {
      errors.push(`${system.id}.${field} references unknown source: ${method.source}`);
    }
    if (sourceRequiredStatuses.has(method.status) && !method.source && !method.notes) {
      errors.push(
        `${system.id}.${field} has status ${method.status} but no source or explanatory note`,
      );
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${systems.length} transit payment records.`);
