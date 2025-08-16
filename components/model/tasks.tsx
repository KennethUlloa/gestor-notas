import { TaskFilter, useTaskRepository } from "@/db/repositories";
import { NewTask, Task, TaskStaus } from "@/db/schema";
import { taskStatus } from "@/utils/computed-values";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import DateTimeField from "../custom/datetime";
import { FieldInput, TextAreaInput } from "../custom/input";
import { Badge, BadgeIcon, BadgeText } from "../ui/badge";
import { Button, ButtonText } from "../ui/button";
import { CheckIcon } from "../ui/icon";

type TaskListItemProps = {
  task: Task;
  onTaskCompleted: (task: NewTask) => void;
};

const TaskStatusColors: Record<
  TaskStaus,
  { action: "info" | "success" | "error" }
> = {
  [TaskStaus.PENDING]: {
    action: "info",
  },
  [TaskStaus.COMPLETED]: {
    action: "success",
  },
  [TaskStaus.LATE]: {
    action: "error",
  },
};

function TaskListItem({ task, onTaskCompleted }: TaskListItemProps) {
  const { t } = useTranslation();
  const status = taskStatus(task);
  const { action } = TaskStatusColors[status];

  const handlePress = () => {
    console.log("Pressed ", task?.title);
  };

  return (
    <View className="flex flex-col gap-5 border border-background-300 rounded-lg p-5 bg-background-0">
      <View className="flex flex-row gap-5 justify-between w-full">
        <Text className="text-xl text-typography-900 font-bold">
          {task.title}
        </Text>
        <Badge action={action} variant="outline">
          <BadgeText>{t(`tasks.status.${status.toLowerCase()}`)}</BadgeText>
        </Badge>
      </View>
      <Text className="text-lg text-typography-600">{task.content}</Text>
      <View className="flex flex-row gap-5 justify-between w-full">
        <Text className="text-lg text-typography-600">
          {new Date(task.dueTo).toLocaleDateString()}
        </Text>
        <Button
          action="primary"
          variant="solid"
          onPress={() => onTaskCompleted(task)}
          size="sm"
        >
          <ButtonText>{t("tasks.actions.complete")}</ButtonText>
        </Button>
      </View>
    </View>
  );
}

type TaskListViewProps = {
  projectId: string;
};

export function TaskListView({ projectId }: TaskListViewProps) {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const taskRepository = useTaskRepository();
  const [filter, setFilter] = useState<TaskFilter>({ projectId });

  const loadTasks = () => {
    taskRepository
      .filter({ ...filter, projectId })
      .then((tasks) => setTasks(tasks))
      .catch(console.error);
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  return (
    <View className="flex flex-col w-full gap-5 flex-1">
      <ScrollView showsVerticalScrollIndicator={false} horizontal className="max-h-16 min-h-16">
        <View className="flex flex-row gap-5 justify-center w-full items-center">
          <Pressable
            onPress={() =>
              setFilter((prev) => ({ ...prev, status: undefined }))
            }
          >
            <Badge action="muted" size="2xl">
                {
                    filter.status === undefined && (
                      <BadgeIcon as={CheckIcon} size="2xl" />
                    )
                }
              <BadgeText className="text-lg">{t("tasks.status.all")}</BadgeText>
            </Badge>
          </Pressable>
          {Object.entries(TaskStaus).map(([key, status]) => (
            <Pressable
              key={key}
              onPress={() => setFilter((prev) => ({ ...prev, status }))}
            >
              <Badge
                key={key}
                action={TaskStatusColors[status].action}
                size="2xl"
              >
                {
                    status === filter.status && (
                      <BadgeIcon as={CheckIcon} size="2xl" />
                    )
                }
                <BadgeText>
                  {t(`tasks.status.${status.toLowerCase()}`)}
                </BadgeText>
              </Badge>
            </Pressable>
          ))}
        </View>
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
                  .then(() => loadTasks())
                  .catch(console.error);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

type CreateTask = Partial<Omit<NewTask, "dueTo">> & {
  dueTo?: Date;
};

type TaskCreateFormProps = {
  onTaskCreated: (task: NewTask) => void;
};

export function TaskCreateForm({ onTaskCreated }: TaskCreateFormProps) {
  const [newTask, setNewTask] = useState<CreateTask>({ dueTo: new Date() });
  const { t } = useTranslation();

  return (
    <View className="flex flex-col gap-5 w-full">
      <FieldInput
        type="text"
        label={t("tasks.fields.title")}
        value={newTask.title}
        placeholder={t("tasks.placeholders.title")}
        onChangeText={(text) => setNewTask({ ...newTask, title: text })}
      />
      <TextAreaInput
        label={t("tasks.fields.content")}
        value={newTask.content}
        placeholder={t("tasks.placeholders.content")}
        onChangeText={(text) => setNewTask({ ...newTask, content: text })}
      />
      <DateTimeField
        label={t("tasks.fields.due_to")}
        value={newTask.dueTo}
        placeholder={t("tasks.placeholders.due_to")}
        minimumDate={new Date()}
        onDateSelected={(date) => setNewTask({ ...newTask, dueTo: date })}
      />
      <Button
        action="primary"
        onPress={() => {
          console.log("Milliseconds", newTask.dueTo?.getTime());
          onTaskCreated({
            ...(newTask as NewTask),
            dueTo: newTask.dueTo?.getTime(),
          });
        }}
      >
        <ButtonText>{t("app.labels.save")}</ButtonText>
      </Button>
    </View>
  );
}
