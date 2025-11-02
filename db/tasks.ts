import { getSettings, Interval } from "@/models/settings";
import { eventBus } from "@/utils/event-bus";
import { useEffect } from "react";
import { useTaskRepository } from "./repositories";

export function DBInitialTasks() {
  const tasks = useTaskRepository();

  const cleanTasks = async () => {
    const settings = await getSettings();
    const difference = settings.cleanInterval * Interval[settings.intervalType];
    const date = Date.now() - difference;
    await tasks.deleteCompletedBefore(date);
    eventBus.emit("task.deleted", null);
  };

  useEffect(() => {
    cleanTasks();
    const unsuscribe = eventBus.subscribe("settings.updated", cleanTasks);
    return () => unsuscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
