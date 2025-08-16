import { Button, ButtonText } from "@/components/ui/button";
import { Task } from "@/db/schema";
import { taskStatus } from "@/utils/computed-values";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import StatusBadge from "./status";

type TaskListItemProps = {
  task: Task;
  onTaskCompleted: (task: Task) => void;
};

function TaskListItem({ task, onTaskCompleted }: TaskListItemProps) {
  const { t } = useTranslation();
  const status = taskStatus(task);

  const handlePress = () => {
    onTaskCompleted(task);
  };

  return (
    <View className="flex flex-col gap-5 border border-background-300 rounded-lg p-5 bg-background-0">
      <View className="flex flex-row gap-5 justify-between w-full">
        <Text className="text-xl text-typography-900 font-bold">
          {task.title}
        </Text>
        <StatusBadge status={status} variant="outline" />
      </View>
      <Text className="text-lg text-typography-600">{task.content}</Text>
      <View className="flex flex-row gap-5 justify-between w-full">
        <Text className="text-lg text-typography-600">
          {new Date(task.dueTo).toLocaleDateString()}
        </Text>
        <Button
          action="primary"
          variant="solid"
          onPress={handlePress}
          size="sm"
        >
          <ButtonText>{t("tasks.actions.complete")}</ButtonText>
        </Button>
      </View>
    </View>
  );
}

export default TaskListItem;