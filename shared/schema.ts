import { pgTable, text, serial, integer, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  isBoardMember: boolean("is_board_member").default(false),
  isExecutiveStaff: boolean("is_executive_staff").default(false),
  position: text("position"), // Job title or board position
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  authorId: integer("author_id").references(() => users.id),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const maintenanceRequests = pgTable("maintenance_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribed: boolean("subscribed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'news', 'event', 'maintenance', 'document', etc.
  read: boolean("read").default(false),
  userId: integer("user_id").references(() => users.id),
  relatedId: integer("related_id"), // ID of the related item (news ID, event ID, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

// Competency assessment tables
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  moduleType: text("module_type").notNull(), // 'board', 'executive', 'regulations', etc.
  passScore: integer("pass_score").notNull(),
  isRequired: boolean("is_required").default(true),
  validityPeriod: integer("validity_period").notNull(), // in months
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessmentQuestions = pgTable("assessment_questions", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull().references(() => assessments.id),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // 'multiple_choice', 'true_false', 'essay'
  options: text("options"), // JSON string of options for multiple choice
  correctAnswer: text("correct_answer").notNull(),
  points: integer("points").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAssessments = pgTable("user_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assessmentId: integer("assessment_id").notNull().references(() => assessments.id),
  score: integer("score").notNull(),
  passed: boolean("passed").notNull(),
  completedAt: timestamp("completed_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attemptCount: integer("attempt_count").notNull().default(1),
  status: text("status").notNull(), // 'current', 'expired', 'needs_renewal'
  createdAt: timestamp("created_at").defaultNow(),
});

export const boardMemberRoles = pgTable("board_member_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // 'president', 'treasurer', 'secretary', etc.
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // null if current
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isAdmin: true,
  isBoardMember: true,
  isExecutiveStaff: true
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  updatedAt: true
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  uploadedAt: true
});

export const insertMaintenanceRequestSchema = createInsertSchema(maintenanceRequests).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  subscribed: true,
  createdAt: true
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  read: true,
  createdAt: true
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAssessmentQuestionSchema = createInsertSchema(assessmentQuestions).omit({
  id: true,
  createdAt: true
});

export const insertUserAssessmentSchema = createInsertSchema(userAssessments).omit({
  id: true,
  createdAt: true
});

export const insertBoardMemberRoleSchema = createInsertSchema(boardMemberRoles).omit({
  id: true,
  createdAt: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type News = typeof news.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Newsletter = typeof newsletters.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type InsertMaintenanceRequest = z.infer<typeof insertMaintenanceRequestSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type InsertAssessmentQuestion = z.infer<typeof insertAssessmentQuestionSchema>;
export type InsertUserAssessment = z.infer<typeof insertUserAssessmentSchema>;
export type InsertBoardMemberRole = z.infer<typeof insertBoardMemberRoleSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type UserAssessment = typeof userAssessments.$inferSelect;
export type BoardMemberRole = typeof boardMemberRoles.$inferSelect;
