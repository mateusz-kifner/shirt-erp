import { sql } from "drizzle-orm";
import { serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "../pgTable";

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  title: varchar("name", { length: 256 }).notNull(),
  content: varchar("content", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
