import { z } from "zod";

export const sectionTypeEnum = z.enum(["TRAVEL", "ACCOMMODATION", "ACTIVITY", "MISCELLANEOUS"]);

export const createTripSchema = z.object({
  title: z.string().min(1, "Trip title is required"),
  destinationPlace: z.string().min(1, "Destination place is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  description: z.string().optional(),
  totalBudget: z.number().min(0, "Budget cannot be negative").optional().default(0),
  currency: z.string().optional().default("USD"),
  coverImage: z.string().optional(),
});

export const updateTripSchema = createTripSchema.partial().extend({
  visibility: z.enum(["PRIVATE", "PUBLIC"]).optional(),
});

export const createSectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  type: sectionTypeEnum.optional().default("ACTIVITY"),
  description: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  budget: z.number().min(0, "Section budget cannot be negative").optional().default(0),
  orderIndex: z.number().int().optional().default(1),
});

export const createBatchSectionsSchema = z.object({
  sections: z.array(createSectionSchema).min(1, "At least one section is required"),
});

export const updateSectionSchema = createSectionSchema.partial();

export const reorderSectionsSchema = z.object({
  sectionOrders: z.array(
    z.object({
      sectionId: z.string(),
      orderIndex: z.number().int(),
    })
  ).min(1, "Section orders array required"),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type CreateBatchSectionsInput = z.infer<typeof createBatchSectionsSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type ReorderSectionsInput = z.infer<typeof reorderSectionsSchema>;
