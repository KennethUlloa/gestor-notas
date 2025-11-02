import { SortDirection } from "@/models/constants";
import {
  and,
  asc,
  count,
  desc,
  eq,
  isNotNull,
  isNull,
  like,
  lt,
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
  UpdateProject,
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
    delete: async (id: string) => {
      await db.delete(schema.project).where(eq(schema.project.id, id));
      await db.delete(schema.task).where(eq(schema.task.projectId, id));
    },
    update: async (id: string, project: UpdateProject) => {
      await db
        .update(schema.project)
        .set(project)
        .where(eq(schema.project.id, id));
      return await db.query.project.findFirst({
        where: (project) => eq(project.id, id),
      });
    },
    exists: async (name: string) => {
      return (
        (
          await db
            .select({ count: count(schema.project.id) })
            .from(schema.project)
            .where(eq(schema.project.name, name))
        )[0]?.count > 0
      );
    },
  };
}

type TaskStatusFilter = TaskStatus | "ALL";

export type TaskFilter = {
  projectId?: string;
  categoryId?: string | null;
  status?: TaskStatusFilter;
  title?: string;
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
    countAll: async () => {
      return (
        (
          await db
            .select({ taskCount: count(schema.task.id) })
            .from(schema.task)
        )[0]?.taskCount || 0
      );
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
      const dbFilter: SQL<unknown>[] = [];

      if (filter.projectId) {
        dbFilter.push(eq(schema.task.projectId, filter.projectId));
      }

      const orderBy: SQL<unknown>[] = [];

      if (filter.title) {
        dbFilter.push(like(schema.task.title, `%${filter.title}%`));
      }

      if (filter.status) {
        switch (filter.status) {
          case TaskStatus.PENDING:
            dbFilter.push(
              // @ts-ignore
              isNull(schema.task.completedAt)
            );
            break;
          case TaskStatus.COMPLETED:
            dbFilter.push(
              // @ts-ignore
              isNotNull(schema.task.completedAt)
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
    deleteCompletedBefore: async (date: number) => {
      return await db
        .delete(schema.task)
        .where(
          and(
            lt(schema.task.completedAt, date),
            isNotNull(schema.task.completedAt)
          )
        );
    },
    deleteCompleted: async () => {
      return await db
        .delete(schema.task)
        .where(isNotNull(schema.task.completedAt));
    }
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
    exists: async (name: string) => {
      return (
        (
          await db
            .select({ count: count(schema.category.id) })
            .from(schema.category)
            .where(eq(schema.category.name, name))
        )[0]?.count > 0
      );
    },
  };
}
