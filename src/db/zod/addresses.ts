import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { addresses } from "../schema/addresses";


export const insertAddressSchema = createInsertSchema(addresses);

export const selectAddressSchema = createSelectSchema(addresses);

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;