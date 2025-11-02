import { ActionSheetWrapper } from "@/components/actionsheet/item-options";
import { IconButton } from "@/components/custom/button-icon";
import TaskFilterForm from "@/components/model/tasks/filter-form";
import TaskListView from "@/components/model/tasks/list-view";
import TaskSortForm from "@/components/model/tasks/sort-form";
import { StatusPicker } from "@/components/model/tasks/status";
import { Button, ButtonText } from "@/components/ui/button";
import { TaskFilter, useTaskRepository } from "@/db/repositories";
import { Task } from "@/db/schema";
import { SortDirection, stackOptions } from "@/models/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function TasksScreen() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const taskRepository = useTaskRepository();

  const loadTaskWithFilter = (filter: TaskFilter) => {
    taskRepository.filter(filter).then(setTasks);
  };

  const deleteTask = (task: Task) => {
    taskRepository.delete(task.id).then(() => loadTaskWithFilter(filter));
  };

  const completeTask = (task: Task) => {
    taskRepository.complete(task.id).then(() => loadTaskWithFilter(filter));
  };

  const uncompleteTask = (task: Task) => {
    taskRepository.uncomplete(task.id).then(() => loadTaskWithFilter(filter));
  };

  const editTask = (task: Task) => {
    router.push({
      pathname: "/tasks/edit",
      params: { id: task.id },
    });
  };

  const handleSortChange = (
    field: string,
    direction: SortDirection,
    checked?: boolean
  ) => {
    setFilter((prev) => {
      const newSort = { ...(prev.sortBy || {}) };
      if (checked) {
        newSort[field as keyof typeof newSort] = direction;
      } else {
        delete newSort[field as keyof typeof newSort];
      }
      return { ...prev, sortBy: newSort } as TaskFilter;
    });
  };

  const handleFilterChange = (filter: TaskFilter) => {
    setFilter(filter);
  };

  const handleApplyFilter = () => {
    setIsFilterOpen(false);
    loadTaskWithFilter(filter);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const loadTaskRef = useRef(() => loadTaskWithFilter(filter));

  useEffect(() => {
    const handler = () => loadTaskRef.current?.();
    handler();
    const cleanCallbacks = [
      eventBus.subscribe("task.created", handler),
      eventBus.subscribe("task.updated", handler),
      eventBus.subscribe("task.deleted", handler),
      eventBus.subscribe("settings.updated", handler),
      eventBus.subscribe("tasks.updated", handler),
      eventBus.subscribe("project.updated", handler),
      eventBus.subscribe("project.deleted", handler),
    ];
    return () => cleanCallbacks.forEach((cb) => cb());
  }, []);

  useEffect(() => {
    loadTaskRef.current = () => loadTaskWithFilter(filter);
  }, [filter]);

  return (
    <>
      <Stack.Screen
        options={{
          ...stackOptions,
          title: t("tasks.titles.list"),
          headerRight: () => (
            <IconButton
              onPress={() => setIsFilterOpen(true)}
              as={SlidersHorizontal}
              className="p-2 rounded-md border mr-5"
              style={{
                borderColor: "#000",
              }}
            />
          ),
        }}
      />
      <View className="flex flex-col flex-1 p-5 items-center bg-background-0">
        <Text className="text-lg text-typography-700 text-center">
          {t("tasks.descriptions.list")}
        </Text>
        <View className="flex flex-col w-full p-5 bg-background-0 gap-5">
          <StatusPicker
            status={filter.status || "ALL"}
            onChange={(status) => {
              setFilter((prev) => ({ ...prev, status }));
              loadTaskWithFilter({ ...filter, status });
            }}
          />
        </View>
        <View className="flex flex-row">
          {tasks.length > 0 && (
            <View className="flex flex-row gap-1 items-center w-full mb-3">
              <Text className="text-md text-typography-900">
                {t("app.labels.total", { total: "" })}
              </Text>
              <View className="p-1 px-2 rounded-full bg-background-100">
                <Text>{tasks.length}</Text>
              </View>
            </View>
          )}
        </View>
        <TaskListView
          tasks={tasks}
          onEdit={editTask}
          onDelete={deleteTask}
          onComplete={completeTask}
          onUncomplete={uncompleteTask}
        />
      </View>
      <ActionSheetWrapper isOpen={isFilterOpen} onClose={handleCloseFilter}>
        <TaskFilterForm filter={filter} onFilterChange={handleFilterChange} />
        <TaskSortForm filter={filter} onSortChange={handleSortChange} />
        <View className="w-full flex flex-row justify-center mt-3">
          <Button onPress={handleApplyFilter} className="self-center" size="xl">
            <ButtonText>{t("app.labels.apply")}</ButtonText>
          </Button>
        </View>
      </ActionSheetWrapper>
    </>
  );
}
