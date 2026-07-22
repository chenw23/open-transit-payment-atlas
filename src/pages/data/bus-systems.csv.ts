import { loadBusSystems } from "@lib/data";

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function GET() {
  const systems = loadBusSystems();
  const headers = [
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
  const rows = systems.map((system) => [
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
  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");

  return new Response(`${csv}\n`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
    },
  });
}
