import { timestamp, varchar } from "drizzle-orm/pg-core";

export const metadata = {
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdById: varchar("created_by_id", { length: 255 }),
  updatedById: varchar("updated_by_id", { length: 255 }),
};
