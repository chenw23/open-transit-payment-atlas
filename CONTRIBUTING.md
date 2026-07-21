# Contributing

Thanks for improving Open Transit Payment Atlas.

This project is about passenger-facing payment facts. A contribution should
answer what a rider can actually use at the gate, at a ticket machine, or in an
official ticketing channel.

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

Add or edit YAML files under `data/systems/`.

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

- Unsourced claims.
- Generic tourist advice without official confirmation.
- Route maps, GTFS feeds, station geometry, or railway infrastructure data.
- Long-distance intercity fare rules unless they are part of an urban transit
  payment system.
