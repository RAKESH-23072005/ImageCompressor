import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const compressionJobs = pgTable("compression_jobs", {
  id: serial("id").primaryKey(),
  originalFileName: text("original_file_name").notNull(),
  originalSize: integer("original_size").notNull(),
  compressedSize: integer("compressed_size"),
  quality: integer("quality").notNull(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompressionJobSchema = createInsertSchema(compressionJobs).omit({
  id: true,
  createdAt: true,
});

export type InsertCompressionJob = z.infer<typeof insertCompressionJobSchema>;
export type CompressionJob = typeof compressionJobs.$inferSelect;
