import { SortDirection } from "@/utils/constants";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  isNotNull,
  isNull,
  lt,
  or,
  SQL,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import {
  NewCategory,
  NewProject,
  NewTask,
  schema,
  Task,
  TaskStatus,
  UpdateTask,
} from "./schema";

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
  categoryId?: string | null;
  status?: TaskStatusFilter;
  sortBy?: {
    createdAt?: SortDirection;
    dueTo?: SortDirection;
    completedAt?: SortDirection;
  };
};

export function useTaskRepository() {
  const ctx = useSQLiteContext();
  const db = drizzle(ctx, { schema });

  return {
    getAllByProjectId: async (projectId: string) => {
      return await db.query.task.findMany({
        where: (task) => eq(task.projectId, projectId),
        with: {
          category: true,
        },
      });
    },
    getById: async (id: string) => {
      return await db.query.task.findFirst({
        where: (task) => eq(task.id, id),
        with: {
          category: true,
        },
      });
    },
    create: async (task: NewTask) => {
      const createdTask = await db.insert(schema.task).values(task).returning();
      return db.query.task.findFirst({
        where: (task) => eq(task.id, createdTask[0]?.id),
        with: { category: true },
      });
    },
    update: async (id: string, task: UpdateTask) => {
      await db.update(schema.task).set(task).where(eq(schema.task.id, id));
      return await db.query.task.findFirst({
        where: (task) => eq(task.id, id),
        with: { category: true },
      });
    },
    complete: async (id: string) => {
      await db
        .update(schema.task)
        .set({ completedAt: Date.now() })
        .where(eq(schema.task.id, id));

      return await db.query.task.findFirst({
        where: (task) => eq(task.id, id),
        with: { category: true },
      });
    },
    uncomplete: async (id: string) => {
      await db
        .update(schema.task)
        .set({ completedAt: null })
        .where(eq(schema.task.id, id));
      return await db.query.task.findFirst({
        where: (task) => eq(task.id, id),
        with: { category: true },
      });
    },
    filter: async (filter: TaskFilter) => {
      const dbFilter: SQL<unknown>[] = [
        eq(schema.task.projectId, filter.projectId),
      ];

      const orderBy: SQL<unknown>[] = [];

      if (filter.status) {
        switch (filter.status) {
          case TaskStatus.PENDING:
            dbFilter.push(
              // @ts-ignore
              and(
                isNull(schema.task.completedAt),
                gt(schema.task.dueTo, Date.now())
              )
            );
            break;
          case TaskStatus.COMPLETED:
            dbFilter.push(
              // @ts-ignore
              and(
                isNotNull(schema.task.completedAt),
                gt(schema.task.dueTo, schema.task.completedAt)
              )
            );
            break;
          case TaskStatus.LATE:
            dbFilter.push(
              // @ts-ignore
              or(
                and(
                  isNotNull(schema.task.completedAt),
                  lt(schema.task.dueTo, schema.task.completedAt)
                ),
                and(
                  isNull(schema.task.completedAt),
                  lt(schema.task.dueTo, Date.now())
                )
              )
            );
            break;
        }
      }

      if (filter.categoryId !== undefined) {
        if (filter.categoryId) {
          dbFilter.push(eq(schema.task.categoryId, filter.categoryId));
        } else {
          dbFilter.push(isNull(schema.task.categoryId));
        }
      }

      if (filter.sortBy?.createdAt) {
        if (filter.sortBy.createdAt === SortDirection.ASC) {
          orderBy.push(asc(schema.task.createdAt));
        } else if (filter.sortBy.createdAt === SortDirection.DESC) {
          orderBy.push(desc(schema.task.createdAt));
        }
      }

      if (filter.sortBy?.dueTo) {
        if (filter.sortBy.dueTo === SortDirection.ASC) {
          orderBy.push(asc(schema.task.dueTo));
        } else if (filter.sortBy.dueTo === SortDirection.DESC) {
          orderBy.push(desc(schema.task.dueTo));
        }
      }

      if (filter.sortBy?.completedAt) {
        if (filter.sortBy.completedAt === SortDirection.ASC) {
          orderBy.push(asc(schema.task.completedAt));
        } else if (filter.sortBy.completedAt === SortDirection.DESC) {
          orderBy.push(desc(schema.task.completedAt));
        }
      }

      // Order by due to by default
      if (orderBy.length === 0) {
        orderBy.push(asc(schema.task.dueTo));
      }

      return (await db.query.task.findMany({
        where: and(...dbFilter),
        with: {
          category: true,
        },
        orderBy,
      })) as Task[];
    },
    delete: async (id: string) => {
      return await db.delete(schema.task).where(eq(schema.task.id, id));
    },
  };
}

export function useCategoryRepository() {
  const ctx = useSQLiteContext();
  const db = drizzle(ctx, { schema });

  return {
    getAll: async () => {
      return await db.query.category.findMany();
    },
    create: async (category: NewCategory) => {
      return await db.insert(schema.category).values(category).returning();
    },
  };
}
