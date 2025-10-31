import { IconButton } from "@/components/custom/button-icon";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Task } from "@/db/schema";
import { daysAppart, empty } from "@/utils/computed-values";
import formatters from "@/utils/formatters";
import { CheckCheck, ChevronDown, ChevronUp, Edit, Trash2, UndoDot } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import CategoryListItem from "../categories/list-item";

export enum TaskAction {
  COMPLETE = "complete",
  DELETE = "delete",
  EDIT = "edit",
  UNCOMPLETE = "uncomplete",
}

type TaskListItemProps = {
  task: Task;
  onPress?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onComplete?: (task: Task) => void;
  onUncomplete?: (task: Task) => void;
};

function CompletionTime({
  dueTo,
  completedAt,
}: {
  dueTo: number;
  completedAt?: number;
}) {
  const { t } = useTranslation();
  let diffDays = 0;
  if (!empty(completedAt)) {
    diffDays = daysAppart(dueTo, completedAt!, true);
  } else {
    diffDays = daysAppart(dueTo, Date.now(), true);
  }

  const singleDay = Math.abs(diffDays) === 1;

  if (diffDays < 0) {
    return (
      <Text className="text-sm text-error-500">
        {singleDay
          ? t("tasks.labels.late_1_day")
          : t("tasks.labels.late_n_days", { days: Math.abs(diffDays) })}
      </Text>
    );
  }
  return (
    <Text className="text-sm text-success-500">
      {singleDay
        ? t("tasks.labels.on_time_1_day")
        : t("tasks.labels.on_time_n_days", { days: Math.abs(diffDays) })}
    </Text>
  );
}

function TaskListItem({ task, onEdit, onDelete, onComplete, onUncomplete }: TaskListItemProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const dueToDate = new Date(task.dueTo);

  const dueToText =
    dueToDate < new Date()
      ? t("tasks.labels.past_due_to", {
          due_to: formatters.date(dueToDate),
        })
      : t("tasks.labels.future_due_to", {
          due_to: formatters.date(dueToDate),
        });

  const toggleComplete = (task: Task) => {
    if (task.completedAt) {
      onUncomplete?.(task);
    } else {
      onComplete?.(task);
    }
  }

  return (
    <View className="flex flex-col gap-5 border border-background-300 rounded-lg p-5 bg-background-0">
      <View className="flex flex-row justify-between w-full items-center">
        <Text className="text-xl text-typography-900 font-bold">
          {task.title}
        </Text>
        <IconButton
          as={expanded ? ChevronUp : ChevronDown}
          onPress={() => setExpanded(!expanded)}
        />
      </View>
      <View className="flex flex-row gap-3 w-full">
        {task.category && (
          <CategoryListItem name={task.category.name} size="sm" />
        )}
        <CompletionTime
          dueTo={task.dueTo}
          completedAt={task.completedAt || undefined}
        />
        <Text>{dueToText}</Text>
      </View>
      {expanded && (
        <>
          <Text className="text-lg text-typography-600 max-w-full">
            {task.content || t("tasks.messages.no_content")}
          </Text>

          <View className="flex flex-row gap-5 flex-wrap">
            <Text>{t('tasks.labels.created_at', { date: formatters.date(task.createdAt)})}</Text>
            {task.completedAt && (
              <Text>{t('tasks.labels.completed_at', { date: formatters.date(task.completedAt)})}</Text>
            )}
          </View>
          <View className="flex flex-row justify-between flex-wrap">
            <Button action="negative" className="w-[30%]" onPress={() => onDelete?.(task)} >
              <ButtonIcon as={Trash2} size="xl" />
            </Button>
            <Button action="secondary" className="w-[30%]" onPress={() => onEdit?.(task)}>
              <ButtonIcon as={Edit} size="xl" />
            </Button>
            <Button action="primary" className="w-[30%]" onPress={() => toggleComplete(task)}>
              <ButtonIcon as={task.completedAt ? UndoDot : CheckCheck} size="xl" />
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

export default TaskListItem;
