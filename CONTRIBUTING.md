# Contributing

Thanks for improving Open Transit Payment Atlas.

This project is about passenger-facing payment facts. A contribution should
answer what a rider can actually use at a rail gate, at a ticket machine, when
boarding a bus, or in an official ticketing channel.

## Before You Edit

Check whether the claim is about:

- direct gate entry;
- ticket purchase or top-up;
- official app or QR ticket;
- local transit card;
- contactless bank card;
- mobile wallet;
- tourist pass;
- partial rollout or pilot;
- discontinued payment method.

Do not combine these into one vague claim.

For bus records, keep the source fields precise even though the website overview
uses broader passenger-facing categories:

- `contactless_bank_card` means a physical debit or credit card presented
  directly to the onboard reader;
- `mobile_wallet` covers a phone or wearable wallet or digital transit card;
- `qr_code` covers a QR or barcode fare credential presented from a device;
- `official_app` records whether an operator or authority app itself provides
  the fare credential, not merely journey planning, account management, or
  top-up.

## Evidence Rules

Preferred sources:

1. Official transit operator page.
2. Official transport authority or city page.
3. Official payment provider or card network page.
4. Official app help page, fare rule, or passenger guide.

Avoid relying on travel blogs, forum posts, or social media unless they are only
used as leads to find official sources.

## Status Values

Use exactly one of:

- `yes`: officially supported and generally usable.
- `partial`: supported only in selected lines, stations, devices, products, or
  rider groups.
- `planned`: officially announced but not fully launched.
- `no`: officially unsupported.
- `unknown`: not verified.
- `deprecated`: previously supported but discontinued or being phased out.

## Editing Data

Add or edit rail YAML files under `data/systems/` and bus YAML files under
`data/bus-systems/`.

Bus contributions should follow the representative-city policy: prioritize a
capital, largest city, or internationally significant network in a major
country. Add another city only when its payment model materially differs or it
fills a clear evidence gap. Bus records must explicitly state whether riders
tap off.

Run:

```bash
npm run validate
```

If you changed many records, also run:

```bash
npm run export:csv
```

## Good Contribution Examples

- Add an official contactless bank-card source for a metro system.
- Correct a `yes` to `partial` when support is only on selected gates.
- Split a vague mobile-wallet claim into bank-card wallet support and local app
  QR support.
- Add a source and note explaining that a ticket machine accepts bank cards but
  gates do not support open-loop tap-to-ride.

## What Not To Add

- Mainland China records. Contribute those to
  [CNRT Rail Pay](https://ivysauro.github.io/CNRT/data/Pay) or
  [CNRT BusPay](https://ivysauro.github.io/CNRT/data/BusPay); Hong Kong, Macao,
  and Taiwan remain in scope here.
- Unsourced claims.
- Generic tourist advice without official confirmation.
- Route maps, GTFS feeds, station geometry, or railway infrastructure data.
- Long-distance intercity fare rules unless they are part of an urban transit
  payment system.
