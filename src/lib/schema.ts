import { z } from "zod";

export const paymentStatusSchema = z.enum([
  "yes",
  "partial",
  "planned",
  "no",
  "unknown",
  "deprecated",
]);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const methodSchema = z.object({
  status: paymentStatusSchema,
  methods: z.array(z.string()).default([]),
  schemes: z.array(z.string()).default([]),
  notes: z.string().optional(),
  source: z.string().optional(),
});

const unknownMethodSchema = methodSchema.default({
  status: "unknown",
  methods: [],
  schemes: [],
});

export const paymentSchema = z.object({
  gate_entry: z.object({
    local_transit_card: unknownMethodSchema,
    contactless_bank_card: unknownMethodSchema,
    mobile_wallet: unknownMethodSchema,
    qr_code: unknownMethodSchema,
    official_app: unknownMethodSchema,
    paper_or_token: unknownMethodSchema,
    tourist_pass: unknownMethodSchema,
  }),
  ticket_machine: z.object({
    cash: unknownMethodSchema,
    bank_card: unknownMethodSchema,
    contactless_card: unknownMethodSchema,
    mobile_wallet: unknownMethodSchema,
    qr_payment: unknownMethodSchema,
  }),
});

export const systemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  country: z.string().min(1),
  city: z.string().min(1),
  region: z.string().optional(),
  system: z.string().min(1),
  operator: z.string().min(1),
  modes: z.array(z.string()).min(1),
  official_website: z.string().url(),
  last_verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  payment: paymentSchema,
  interoperability: z.object({
    open_loop: paymentStatusSchema.default("unknown"),
    fare_capping: paymentStatusSchema.default("unknown"),
    regional_card: paymentStatusSchema.default("unknown"),
    national_card: paymentStatusSchema.default("unknown"),
    notes: z.string().optional(),
  }),
  sources: z.array(sourceSchema).min(1),
  notes: z.string().optional(),
});

export const systemFileSchema = z.array(systemSchema);

export type TransitSystem = z.infer<typeof systemSchema>;
export type PaymentMethod = z.infer<typeof methodSchema>;
export type Source = z.infer<typeof sourceSchema>;
