import {
  integer,
  text,
  boolean,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

export const ip = pgTable("ip", {
  id: integer("id").primaryKey(),
  ip: text("ip").notNull(),
  last_check: timestamp("created_at").defaultNow().notNull(),
});
