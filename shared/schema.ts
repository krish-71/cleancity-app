import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(), // We'll use this for email
  password: text("password").notNull(),
  role: text("role", { enum: ["citizen", "admin", "pending_admin"] }).default("citizen").notNull(),
});

export const complaints = sqliteTable("complaints", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category", { enum: ["organic", "recyclable", "hazardous", "construction", "other"] }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  address: text("address").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "resolved", "rejected"] }).default("pending").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  username: true,
  password: true,
  role: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;
