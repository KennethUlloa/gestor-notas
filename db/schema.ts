import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid/non-secure";

export const project = sqliteTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const category = sqliteTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull().unique(),
});

export const task = sqliteTable("task", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  content: text("content"),
  completedAt: integer("completed_at"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  dueTo: integer("due_to")
    .notNull()
    .$defaultFn(() => Date.now()),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => category.id, {
    onDelete: "set null",
  }),
});

export const taskRelations = relations(task, ({ one }) => ({
  project: one(project, { fields: [task.projectId], references: [project.id] }),
  category: one(category, {
    fields: [task.categoryId],
    references: [category.id],
  }),
}));

export const projectRelations = relations(project, ({ many }) => ({
  tasks: many(task),
}));

export const schema = {
  task,
  project,
  category,
  taskRelations,
  projectRelations,
};

export type Category = typeof category.$inferSelect;
export type Task = typeof task.$inferSelect & { category?: Category };
export type Project = typeof project.$inferSelect;

export type NewTask = typeof task.$inferInsert;
export type NewProject = typeof project.$inferInsert;
export type NewCategory = typeof category.$inferInsert;

export type UpdateTask = Partial<NewTask>;
export type UpdateProject = Partial<NewProject>;
export type UpdateCategory = Partial<NewCategory>;

export enum TaskStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}
