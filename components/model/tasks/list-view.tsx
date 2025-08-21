import { Task } from "@/db/schema";
import { Check, CircleDotDashed, SquarePen, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import TaskListItem, { TaskAction, TaskActionOption } from "./list-item";

type TaskListViewProps = {
  tasks: Task[];
  onTaskAction?: (action: TaskAction, task: Task) => void;
};

function TaskListView({ tasks, onTaskAction }: TaskListViewProps) {
  const { t } = useTranslation();

  const getActions = (task: Task) => {
    const baseActions: TaskActionOption[] = [
      {
        icon: SquarePen,
        label: t("tasks.actions.edit"),
        action: TaskAction.EDIT,
        type: "primary",
        variant: "outline",
        className: "flex-1",
      },
      {
        icon: Trash2,
        label: t("tasks.actions.delete"),
        action: TaskAction.DELETE,
        type: "negative",
        variant: "outline",
        className: "flex-1",
      },
    ];

    if (task.completedAt) {
      baseActions.push({
        icon: CircleDotDashed,
        label: t("tasks.actions.uncomplete"),
        action: TaskAction.UNCOMPLETE,
        className: "flex-1",
        variant: "solid",
        type: "secondary",
      });
    } else {
      baseActions.push({
        icon: Check,
        label: t("tasks.actions.complete"),
        action: TaskAction.COMPLETE,
        className: "flex-1",
        variant: "solid",
        type: "positive",
      });
    }

    return baseActions;
  };
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
              onTaskAction={onTaskAction}
              actions={getActions(task)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default TaskListView;
