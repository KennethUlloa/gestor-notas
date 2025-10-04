import { Task } from "@/db/schema";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import TaskListItem from "./list-item";

type TaskListViewProps = {
  tasks: Task[];
  onPress?: (task: Task) => void;
};

function TaskListView({ tasks, onPress }: TaskListViewProps) {
  const { t } = useTranslation();
  return (
    <View className="flex flex-col w-full gap-5 flex-1">
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
              onPress={onPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default TaskListView;
