import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Task } from "@/db/schema";
import { taskStatus } from "@/utils/computed-values";
import formatters from "@/utils/formatters";
import { CalendarDays, Check, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import StatusBadge from "./status";

type DatePillProps = {
  date?: Date | number | string | null;
  label: string;
};

function DatePill({ date, label }: DatePillProps) {
  return (
    <View className="flex flex-column gap-1 items-start">
      <View className="flex flex-row gap-1 items-center">
        <Icon as={CalendarDays} className="text-typography-700" size="sm" />
        <Text className="text-sm text-typography-700">{label}</Text>
      </View>
      <Text className="text-md text-typography-800 font-semibold">
        {formatters.dateTime(date ?? undefined)}
      </Text>
    </View>
  );
}

export enum TaskAction {
  COMPLETE = "complete",
  DELETE = "delete",
}

type TaskListItemProps = {
  task: Task;
  onTaskAction?: (action: TaskAction, task: Task) => void;
};

function TaskListItem({ task, onTaskAction }: TaskListItemProps) {
  const { t } = useTranslation();
  const status = taskStatus(task);

  const handleComplete = () => {
    onTaskAction?.(TaskAction.COMPLETE, task);
  };

  const handleDelete = () => {
    onTaskAction?.(TaskAction.DELETE, task);
  };

  return (
    <View className="flex flex-col gap-5 border border-background-300 rounded-lg p-5 bg-background-0">
      <View className="flex flex-row gap-5 justify-between w-full">
        <Text className="text-xl text-typography-900 font-bold">
          {task.title}
        </Text>
        <StatusBadge status={status} variant="outline" />
      </View>
      <Text className="text-lg text-typography-600 text-ellipsis max-w-full max-h-20">{task.content}</Text>
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
      <View className="flex flex-row gap-5 justify-end w-full">
        <Button
          action="negative"
          variant="outline"
          onPress={handleDelete}
          size="sm"
        >
          <ButtonIcon as={Trash2} />
          <ButtonText>{t("tasks.actions.delete")}</ButtonText>
        </Button>
        <Button variant="outline" onPress={handleComplete} size="sm">
          <ButtonIcon as={Check} />
          <ButtonText>{t("tasks.actions.complete")}</ButtonText>
        </Button>
      </View>
    </View>
  );
}

export default TaskListItem;
