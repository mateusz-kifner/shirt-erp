import { addresses } from "@/db/schema/addresses";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const insertAddressSchema = createInsertSchema(addresses);

export const selectAddressSchema = createSelectSchema(addresses);

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;