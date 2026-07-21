import { loadSystems } from "@lib/data";

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function GET() {
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
  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");

  return new Response(`${csv}\n`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
    },
  });
}
