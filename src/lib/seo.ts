import type { TransitSystem } from "./schema";
import type { BusSystem } from "./schema";

export const SITE_NAME = "Open Transit Payment Atlas";
export const SITE_ORIGIN = "https://chenw23.github.io";
export const SITE_BASE_PATH = "/open-transit-payment-atlas";

export const HOME_TITLE =
  "Rail Transit Payment Methods | Open Transit Payment Atlas";

export function homeDescription(
  systemCount: number,
  countryCount: number,
): string {
  return `Compare fare-gate and ticket-machine payment methods for ${systemCount} metro and urban rail systems across ${countryCount} countries and regions, excluding mainland China.`;
}

export function systemTitle(system: TransitSystem): string {
  const locationPrefix = system.system
    .toLocaleLowerCase("en")
    .includes(system.city.toLocaleLowerCase("en"))
    ? ""
    : `${system.city} `;
  return `${locationPrefix}${system.system} Payment Methods | Transit Payment Atlas`;
}

export function systemDescription(system: TransitSystem): string {
  return `Payment methods for ${system.system} in ${system.city}: transit cards, contactless bank cards, mobile wallets, QR gate entry, cash and ticket-machine cards.`;
}

export function systemModifiedDate(system: TransitSystem): string {
  return [system.last_verified, ...system.sources.map((source) => source.accessed)]
    .sort()
    .at(-1) as string;
}

export function busSystemTitle(system: BusSystem): string {
  const locationPrefix = system.network
    .toLocaleLowerCase("en")
    .includes(system.city.toLocaleLowerCase("en"))
    ? ""
    : `${system.city} `;
  return `${locationPrefix}${system.network} Bus Payment Methods | Transit Payment Atlas`;
}

export function busSystemDescription(system: BusSystem): string {
  return `Bus payment methods for ${system.network} in ${system.city}: cash, transit cards, contactless bank cards, mobile wallets, QR or app tickets, and tap-off rules.`;
}

export function busSystemModifiedDate(system: BusSystem): string {
  return [system.last_verified, ...system.sources.map((source) => source.accessed)]
    .sort()
    .at(-1) as string;
}

export function siteUrl(path = "/"): URL {
  const siteOrigin = new URL(SITE_ORIGIN);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(`${SITE_BASE_PATH}${normalizedPath}`, siteOrigin);
}
