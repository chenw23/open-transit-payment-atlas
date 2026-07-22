import { loadBusSystems } from "@lib/data";

export function GET() {
  return new Response(JSON.stringify(loadBusSystems(), null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
