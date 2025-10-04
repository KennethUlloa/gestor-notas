import { DatePill } from "@/components/custom/date-pill";
import CategoryListItem from "@/components/model/categories/list-item";
import StatusBadge from "@/components/model/tasks/status";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useTaskRepository } from "@/db/repositories";
import { Task, TaskStatus } from "@/db/schema";
import { showError } from "@/hooks/toast";
import { taskStatus } from "@/utils/computed-values";
import { stackOptions } from "@/utils/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Check, CircleDotDashed, Pencil, Trash2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

function TaskViewScreen() {
  const { t } = useTranslation();
  const search = useLocalSearchParams();
  const taskId = Array.isArray(search.id) ? search.id[0] : search.id;

  const taskRepository = useTaskRepository();
  const [task, setTask] = useState<Task | null>(null);
  const [status, setStatus] = useState<TaskStatus>();
  const isCompleted = !!task?.completedAt;

  const loadTask = () => {
    taskRepository
      .getById(taskId as string)
      .then((task) => {
        setTask(task as Task);
        setStatus(taskStatus(task as Task));
      })
      .catch(showError);
  };

  const handleTaskUpdate = (task: Task) => {
    console.log('task updated', task.id);
    console.log('current task', taskId);
    if (task.id !== taskId) return;
    loadTask();
  };

  const loadTaskRef = useRef(handleTaskUpdate);

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    loadTaskRef.current = handleTaskUpdate;
  }, [handleTaskUpdate, loadTask]);

  useEffect(() => {
    const handler = (task: Task) => loadTaskRef.current?.(task);
    const cleanCallbacks = [
      eventBus.subscribe("task.updated", handler),
      eventBus.subscribe("task.completed", handler),
      eventBus.subscribe("task.uncompleted", handler),
    ];
    return () => cleanCallbacks.forEach((cb) => cb());
  }, []);

  const handleDelete = () =>
    taskRepository
      .delete(taskId as string)
      .then(() => {
        router.back();
        eventBus.emit("task.deleted", task);
      })
      .catch(showError);

  const handleComplete = () =>
    taskRepository
      .complete(taskId as string)
      .then(() => {
        eventBus.emit("task.completed", task);
      })
      .catch(showError);

  const handleUncomplete = () =>
    taskRepository
      .uncomplete(taskId as string)
      .then(() => {
        eventBus.emit("task.uncompleted", task);
      })
      .catch(showError);

  const handleEdit = () =>
    router.push({
      pathname: "/tasks/edit",
      params: { id: taskId },
    });

  return (
    <>
      <Stack.Screen
        options={{ title: t("tasks.titles.show"), ...stackOptions }}
      />
      <View className="flex flex-col bg-background-0 flex-1 p-5 gap-5">
        <Text className="font-bold text-typography-00 text-2xl">
          {task?.title}
        </Text>
        <View className="flex flex-row gap-3 w-full">
          {status && (
            <StatusBadge
              status={status as TaskStatus}
              variant="solid"
              size="lg"
            />
          )}
          {task?.category && (
            <CategoryListItem name={task.category.name} size="lg" />
          )}
        </View>
        {task && (
          <View className="flex flex-row gap-5 flex-wrap">
            <DatePill
              date={task.createdAt}
              label={t("tasks.fields.created_at")}
            />
            <DatePill date={task.dueTo} label={t("tasks.fields.due_to")} />
            {task.completedAt && (
              <DatePill
                date={task.completedAt}
                label={t("tasks.fields.completed_at")}
              />
            )}
          </View>
        )}
        <ScrollView contentContainerClassName="flex flex-col flex-1">
          {task?.content && (
            <Text
              className="text-xl text-typography-600 flex-1"
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {task.content}
            </Text>
          )}
        </ScrollView>
        <View className="flex flex-col gap-5 w-full">
          <Button
            action="primary"
            size="xl"
            variant="outline"
            onPress={handleEdit}
          >
            <ButtonIcon as={Pencil} />
            <ButtonText>{t("tasks.actions.edit")}</ButtonText>
          </Button>
          <Button
            action="negative"
            size="xl"
            variant="outline"
            onPress={handleDelete}
          >
            <ButtonIcon as={Trash2} />
            <ButtonText>{t("tasks.actions.delete")}</ButtonText>
          </Button>
          <Button
            size="xl"
            action={isCompleted ? "secondary" : "primary"}
            onPress={isCompleted ? handleUncomplete : handleComplete}
          >
            <ButtonIcon as={isCompleted ? CircleDotDashed : Check} />
            <ButtonText>
              {t(`tasks.actions.${isCompleted ? "uncomplete" : "complete"}`)}
            </ButtonText>
          </Button>
        </View>
      </View>
    </>
  );
}

export default TaskViewScreen;
