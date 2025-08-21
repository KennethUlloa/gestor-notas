import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Task } from "@/db/schema";
import { taskStatus } from "@/utils/computed-values";
import formatters from "@/utils/formatters";
import { CalendarDays } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import CategoryListItem from "../categories/list-item";
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
  EDIT = "edit",
  UNCOMPLETE = "uncomplete",
}

export type TaskActionOption = {
  action: TaskAction;
  label: string;
  icon?: React.ComponentProps<typeof Icon>["as"];
  iconSize?: "sm" | "md" | "lg";
  variant? : "solid" | "outline";
  type?: "primary" | "secondary" | "negative" | "positive";
  className?: string;
};

type TaskListItemProps = {
  task: Task;
  actions?: TaskActionOption[];
  onTaskAction?: (action: TaskAction, task: Task) => void;
};

function TaskListItem({ task, actions, onTaskAction }: TaskListItemProps) {
  const { t } = useTranslation();
  const status = taskStatus(task);

  return (
    <View className="flex flex-col gap-5 border border-background-300 rounded-lg p-5 bg-background-0">
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
        <Text className="text-lg text-typography-600 max-w-full" ellipsizeMode="tail" numberOfLines={3}>
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
      <View className="flex flex-row gap-5 justify-end w-full">
        {
          actions?.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              action={action.type}
              onPress={() => onTaskAction?.(action.action, task)}
              size="sm"
              className={action.className}
            >
              <ButtonIcon as={action.icon} size={action.iconSize} />
              <ButtonText>{action.label}</ButtonText>
            </Button>
          ))
        }
      </View>
    </View>
  );
}

export default TaskListItem;
