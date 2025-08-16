import { TaskFilter, useTaskRepository } from "@/db/repositories";
import { Task } from "@/db/schema";
import { eventBus } from "@/utils/event-bus";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import TaskListItem from "./list-item";
import { StatusPicker } from "./status";

type TaskListViewProps = {
    projectId: string;
};

function TaskListView({ projectId }: TaskListViewProps) {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const taskRepository = useTaskRepository();
  const [filter, setFilter] = useState<TaskFilter>({ projectId, status: "ALL" });

  const loadTasks = () => {
    taskRepository
      .filter({ ...filter, projectId })
      .then((tasks) => setTasks(tasks))
      .catch(console.error);
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  useEffect(() => {
    loadTasks();
    return eventBus.subscribe("task.created", loadTasks);
  }, []);

  return (
    <View className="flex flex-col w-full gap-5 flex-1">
      <ScrollView showsVerticalScrollIndicator={false} horizontal className="max-h-16 min-h-16">
        <StatusPicker status={filter.status || "ALL"} onChange={(status) => setFilter((prev) => ({ ...prev, status }))} />
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} >
        <View className="flex flex-col gap-5 flex-1 h-full">
          {tasks.length === 0 && (
            <Text className="text-xl text-typography-600 text-center">
              {t("tasks.messages.no_tasks")}
            </Text>
          )}
          {tasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onTaskCompleted={() => {
                taskRepository
                  .complete(task.id)
                  .catch(console.error);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default TaskListView;