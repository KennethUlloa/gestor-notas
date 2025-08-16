import { and, eq, gt, isNotNull, isNull, lt, or, SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { NewProject, NewTask, schema, Task, TaskStatus } from "./schema";

export function useProjectRepository() {
  const ctx = useSQLiteContext();
  const db = drizzle(ctx, { schema });

  return {
    getAll: async () => {
      return await db.query.project.findMany();
    },
    getById: async (id: string) => {
      return await db.query.project.findFirst({
        where: (project) => eq(project.id, id),
      });
    },
    create: async (project: NewProject) => {
      return await db.insert(schema.project).values(project).returning();
    },
  };
}

type TaskStatusFilter = TaskStatus | "ALL";

export type TaskFilter = {
  projectId: string;
  status?: TaskStatusFilter;
};

export function useTaskRepository() {
  const ctx = useSQLiteContext();
  const db = drizzle(ctx, { schema });

  return {
    getByProjectId: async (projectId: string) => {
      return await db.query.task.findMany({
        where: (task) => eq(task.projectId, projectId),
      });
    },
    getById: async (id: string) => {
      return await db.query.task.findFirst({
        where: (task) => eq(task.id, id),
      });
    },
    create: async (task: NewTask) => {
      return await db.insert(schema.task).values(task).returning();
    },
    update: async (task: Task) => {
      return await db
        .update(schema.task)
        .set(task)
        .where(eq(schema.task.id, task.id))
        .returning();
    },
    complete: async (id: string) => {
      return await db
        .update(schema.task)
        .set({ completedAt: Date.now() })
        .where(eq(schema.task.id, id))
        .returning();
    },
    filter: async (filter: TaskFilter) => {
      const dbFilter: SQL<unknown>[] = [
        eq(schema.task.projectId, filter.projectId),
      ];

      if (filter.status) {
        switch (filter.status) {
          case TaskStatus.PENDING:
            dbFilter.push(
              // @ts-ignore
              and(isNull(schema.task.completedAt), gt(schema.task.dueTo, Date.now()))
            );
            break;
          case TaskStatus.COMPLETED:
            // @ts-ignore
            dbFilter.push(and(isNotNull(schema.task.completedAt), gt(schema.task.dueTo, schema.task.completedAt)));
            break;
          case TaskStatus.LATE:
            dbFilter.push(
              // @ts-ignore
              or(
                and(isNotNull(schema.task.completedAt), lt(schema.task.dueTo, schema.task.completedAt)),
                and(isNull(schema.task.completedAt), lt(schema.task.dueTo, Date.now()))
              )
            );
            break;
        }
      }
      return await db
        .select()
        .from(schema.task)
        .where(and(...dbFilter));
    },
  };
}
