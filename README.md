# Open Transit Payment Atlas

Open Transit Payment Atlas is an evidence-backed database of passenger-facing
payment methods for rail transit and representative major-city bus networks
around the world.

It answers practical questions:

- Can I tap a contactless bank card at the gate?
- Can I pay on board a city bus, and do I need to tap off?
- Which schemes work, such as Visa, Mastercard, American Express, JCB, Discover,
  UnionPay, or local card schemes?
- Can I use Apple Pay, Google Pay, Samsung Pay, or a local mobile wallet?
- Do I need a local transit card?
- Can I buy or top up a ticket at a vending machine with cash or a bank card?
- Is the rule network-wide, partial, planned, deprecated, or unknown?
- What official source supports the claim?

The project is inspired by the passenger-facing payment matrix style of CNRT,
but uses structured YAML data, TypeScript validation, and generated static pages.

## Scope

The initial scope is rail-first and excludes mainland China to avoid duplicating
[CNRT's payment-method coverage](https://ivysauro.github.io/CNRT/data/Pay).
Hong Kong, Macao, and Taiwan records are included in this atlas.

Included:

- metro, subway, and underground systems;
- urban and suburban rail systems used as metropolitan transit;
- airport rail links;
- light rail, tram, monorail, and automated guideway systems where the payment
  model is comparable.
- representative major-city public bus networks.

Not the primary focus:

- long-distance intercity rail ticketing;
- intercity coaches, school buses, private shuttles, and exhaustive bus-route
  coverage;
- pure route geometry or GTFS schedule data;
- railway infrastructure such as track speed, signalling, or electrification.

## Technology

- Astro for static site generation.
- TypeScript for data loading, validation, and exports.
- YAML as the human-editable source of truth.
- Zod for schema validation.
- GitHub Pages for hosting.

## Coverage

The rail dataset starts with representative systems across major metro countries
and regions rather than claiming exhaustive worldwide coverage. Each system is
researched independently; a payment method supported in one city is not assumed
to work elsewhere in the same country.

The bus dataset is intentionally city-selective because worldwide bus coverage
would be unbounded. It prioritizes:

1. one capital, largest city, or internationally significant bus network in a
   major country;
2. additional cities only when their payment model materially differs or the
   official evidence is especially useful;
3. urban public bus services, excluding intercity coaches, school buses, and
   private shuttles.

Mainland China data is maintained by CNRT and should not be duplicated here:

- Rail: https://ivysauro.github.io/CNRT/data/Pay
- Bus: https://ivysauro.github.io/CNRT/data/BusPay

## Data

Records live under `data/systems/`.

Each record distinguishes:

- gate entry;
- ticket vending machine or ticket purchase;
- local transit cards;
- contactless bank cards;
- mobile wallets;
- QR and app-based tickets;
- tourist passes;
- interoperability, fare capping, and open-loop status;
- official sources.

The bus overview groups mobile wallets, digital transit cards, QR or barcode
tickets, and official ticketing apps under **Mobile payment** because the rider
presents a phone or wearable in each case. The source data keeps these methods
separate so that the supported app, credential, and validation technology can
still be verified precisely.

Status values:

- `yes`
- `partial`
- `planned`
- `no`
- `unknown`
- `deprecated`

## Development

```bash
npm install
npm run validate
npm run dev
```

Build:

```bash
npm run build
```

Export machine-readable data:

```bash
npm run export:csv
```

## Contribution Standard

Every non-obvious payment claim should be backed by an official source:

1. transit operator page;
2. city or government transport page;
3. payment provider or card network page;
4. official app help page or fare rule.

Do not infer support. For example, if Visa is supported, do not assume Apple Pay
or all contactless bank cards are supported unless the official source says so.

See `CONTRIBUTING.md` for details.
