import {
  ItemOptions,
  useItemOptions,
} from "@/components/actionsheet/item-options";
import { IconButton } from "@/components/custom/button-icon";
import TaskFilterForm from "@/components/model/tasks/filter-form";
import TaskListView from "@/components/model/tasks/list-view";
import TaskSortForm from "@/components/model/tasks/sort-form";
import { StatusPicker } from "@/components/model/tasks/status";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  TaskFilter,
  useProjectRepository,
  useTaskRepository,
} from "@/db/repositories";
import { Project, Task } from "@/db/schema";
import { showError } from "@/hooks/toast";
import { SortDirection, stackOptions } from "@/utils/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Plus, SlidersHorizontal } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ProjectShowScreen() {
  const { t } = useTranslation();
  const { projectId } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({
    projectId: projectId as string,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const projectRepository = useProjectRepository();
  const taskRepository = useTaskRepository();
  const itemOptions = useItemOptions();

  const loadProject = () => {
    projectRepository
      .getById(projectId as string)
      .then((project) => setProject(project as Project))
      .catch(showError);
  };

  const loadTasks = useCallback(() => {
    loadTaskWithFilter(filter);
  }, [filter]);

  const loadTaskWithFilter = (filter: TaskFilter) => {
    console.log("filter", filter);
    taskRepository
      .filter({
        ...filter,
        projectId: projectId as string,
      })
      .then(setTasks)
      .catch(showError);
  };

  const loadTaskRef = useRef(loadTasks);

  useEffect(() => {
    loadProject();
    loadTasks();
  }, []);

  useEffect(() => {
    const handler = () => loadTaskRef.current?.();
    const cleanCallbacks = [
      eventBus.subscribe("task.created", handler),
      eventBus.subscribe("task.updated", handler),
      eventBus.subscribe("task.deleted", handler),
    ];
    return () => cleanCallbacks.forEach((cb) => cb());
  }, []);

  useEffect(() => {
    loadTaskRef.current = loadTasks;
  }, [loadTasks]);

  const deleteTask = (task: Task) => {
    taskRepository
      .delete(task.id)
      .then(() => loadTaskWithFilter(filter))
      .catch(showError);
  };

  const completeTask = (task: Task) => {
    taskRepository
      .complete(task.id)
      .then(() => loadTaskWithFilter(filter))
      .catch(showError);
  };

  const uncompleteTask = (task: Task) => {
    taskRepository
      .uncomplete(task.id)
      .then(() => loadTaskWithFilter(filter))
      .catch(showError);
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

  return (
    <>
      <Stack.Screen
        options={{
          ...stackOptions,
          title: project?.name || t("projects.titles.show"),
          headerTintColor: "#000",
          headerStyle: { backgroundColor: project?.color },
          headerRight: () => (
            <IconButton
              onPress={() => setIsFilterOpen(true)}
              as={SlidersHorizontal}
              className="p-2 rounded-md border"
              style={{
                borderColor: "#000"
              }}
            />
          ),
        }}
      />

      <View className="flex flex-col w-full p-5 bg-background-0 gap-5">
        <StatusPicker
          status={filter.status || "ALL"}
          
          onChange={(status) => {
            setFilter((prev) => ({ ...prev, status }));
            loadTaskWithFilter({ ...filter, status });
          }}
        />
      </View>
      <View className="flex flex-col flex-1 p-5 bg-background-0 gap-5">
        <View className="flex flex-row">
          {tasks.length > 0 && (
            <View className="flex flex-row gap-1 items-center">
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
        <Button
          style={{ backgroundColor: project?.color }}
          onPress={() => {
            router.push(`/tasks/create?projectId=${projectId}`);
          }}
          size="xl"
          className="self-center mb-5"
        >
          <ButtonIcon as={Plus} size="lg" style={{ color: "#000" }}  />
          <ButtonText style={{ color: "#000" }}>{t("tasks.actions.new_task")}</ButtonText>
        </Button>
      </View>
      <ItemOptions
        options={itemOptions.options}
        isOpen={itemOptions.isOpen}
        onOpen={itemOptions.onOpen}
        onClose={itemOptions.onClose}
      />

      <Actionsheet isOpen={isFilterOpen} onClose={handleCloseFilter}>
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <TaskFilterForm
              filter={filter}
              onFilterChange={handleFilterChange}
            />
            <TaskSortForm filter={filter} onSortChange={handleSortChange} />
            <View className="w-full flex flex-row justify-center mt-3">
              <Button
                onPress={handleApplyFilter}
                className="self-center"
                size="xl"
              >
                <ButtonText>{t("app.labels.apply")}</ButtonText>
              </Button>
            </View>
          </ActionsheetContent>
        </SafeAreaView>
      </Actionsheet>
    </>
  );
}

export default ProjectShowScreen;
