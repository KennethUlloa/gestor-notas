import AnimatedPressable from "@/components/custom/animated-pressble";
import { DatePill } from "@/components/custom/date-pill";
import { Task } from "@/db/schema";
import { taskStatus } from "@/utils/computed-values";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import CategoryListItem from "../categories/list-item";
import StatusBadge from "./status";

export enum TaskAction {
  COMPLETE = "complete",
  DELETE = "delete",
  EDIT = "edit",
  UNCOMPLETE = "uncomplete",
}

type TaskListItemProps = {
  task: Task;
  onPress?: (task: Task) => void;
};

function TaskListItem({ task, onPress }: TaskListItemProps) {
  const { t } = useTranslation();
  const status = taskStatus(task);

  const handlePress = () => onPress?.(task);

  return (
    <AnimatedPressable
      className="flex flex-col gap-5 border border-background-300 rounded-lg p-5 bg-background-0"
      onPress={handlePress}
    >
      <Text className="text-xl text-typography-900 font-bold">
        {task.title}
      </Text>
      <View className="flex flex-row gap-3 w-full">
        <StatusBadge status={status} variant="solid" />
        {task.category && (
          <CategoryListItem name={task.category.name} size="sm" />
        )}
      </View>
      {task.content && (
        <Text
          className="text-lg text-typography-600 max-w-full"
          ellipsizeMode="tail"
          numberOfLines={2}
        >
          {task.content}
        </Text>
      )}
      <View className="flex flex-row gap-5 flex-wrap">
        <DatePill date={task.createdAt} label={t("tasks.fields.created_at")} />
        <DatePill date={task.dueTo} label={t("tasks.fields.due_to")} />
        {task.completedAt && (
          <DatePill
            date={task.completedAt}
            label={t("tasks.fields.completed_at")}
          />
        )}
      </View>
    </AnimatedPressable>
  );
}

export default TaskListItem;
