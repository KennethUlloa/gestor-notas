import { Task } from "@/db/schema";
import { eventBus } from "@/utils/event-bus";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import TaskListItem from "./list-item";

type TaskListViewProps = {
  tasks: Task[];
};

function TaskListView({ tasks }: TaskListViewProps) {
  const { t } = useTranslation();
  return (
    <View className="flex flex-col w-full gap-5 flex-1">
      <Text className="text-md text-typography-700">
        {t("app.labels.total", { total: tasks.length })}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                eventBus.emit("task.completed", task);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default TaskListView;
