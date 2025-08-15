import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { NewProject, NewTask, schema, Task } from "./schema";

export function useProjectRepository() {
  const ctx = useSQLiteContext();
  const db = drizzle(ctx, { schema });

  return {
    getAll: async () => {
      return await db.query.project.findMany();
    },
    getById: async (id: string) => {
      return await db.query.project.findFirst({ where: (project) => eq(project.id, id) });
    },
    create: async (project: NewProject) => {
      return await db.insert(schema.project).values(project).returning();
    },
  }
}

export function useTaskRepository() {
  const ctx = useSQLiteContext();
  const db = drizzle(ctx, { schema });

  return {
    getByProjectId: async (projectId: string) => {
      return await db.query.task.findMany({ where: (task) => eq(task.projectId, projectId) });
    },
    getById: async (id: string) => {
      return await db.query.task.findFirst({ where: (task) => eq(task.id, id) });
    },
    create: async (task: NewTask) => {
      return await db.insert(schema.task).values(task).returning();
    },
    update: async (task: Task) => {
      return await db.update(schema.task).set(task).where(eq(schema.task.id, task.id)).returning();
    },
  }
}