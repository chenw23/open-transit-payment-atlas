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

export const paymentSchema = z.object({
  gate_entry: z.object({
    local_transit_card: methodSchema,
    contactless_bank_card: methodSchema,
    mobile_wallet: methodSchema,
    qr_code: methodSchema,
    official_app: methodSchema,
    paper_or_token: methodSchema,
    tourist_pass: methodSchema,
  }),
  ticket_machine: z.object({
    cash: methodSchema,
    bank_card: methodSchema,
    contactless_card: methodSchema,
    mobile_wallet: methodSchema,
    qr_payment: methodSchema,
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
    open_loop: paymentStatusSchema,
    fare_capping: paymentStatusSchema,
    regional_card: paymentStatusSchema,
    national_card: paymentStatusSchema,
    notes: z.string().optional(),
  }),
  sources: z.array(sourceSchema).min(1),
  notes: z.string().optional(),
});

export const systemFileSchema = z.array(systemSchema);

export type TransitSystem = z.infer<typeof systemSchema>;
export type PaymentMethod = z.infer<typeof methodSchema>;
export type Source = z.infer<typeof sourceSchema>;
