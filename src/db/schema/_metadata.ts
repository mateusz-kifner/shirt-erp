import { integer, timestamp } from "drizzle-orm/pg-core";

export const metadata = {
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdById: integer("created_by_id"),
  updatedById: integer("updated_by_id"),
};
