import TaskListView from "@/components/model/tasks/list-view";
import { StatusPicker } from "@/components/model/tasks/status";
import { Button, ButtonText } from "@/components/ui/button";
import {
    TaskFilter,
    useProjectRepository,
    useTaskRepository,
} from "@/db/repositories";
import { Project, Task } from "@/db/schema";
import { stackOptions } from "@/utils/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

function ProjectShowScreen() {
  const { t } = useTranslation();
  const { projectId } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({
    projectId: projectId as string,
  });
  const projectRepository = useProjectRepository();
  const taskRepository = useTaskRepository();

  const loadProject = () => {
    projectRepository
      .getById(projectId as string)
      .then((project) => setProject(project as Project))
      .catch(console.error);
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
      .catch(console.error);
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
      eventBus.subscribe("task.completed", (newTask) => {
        console.log("completed", newTask);
        taskRepository.complete(newTask.id).then(() => loadTaskRef.current?.());
      }),
    ];

    return () => cleanCallbacks.forEach((cb) => cb());
  }, []);

  useEffect(() => {
    loadTaskRef.current = loadTasks;
  }, [loadTasks]);

  return (
    <>
      <Stack.Screen options={{ title: project?.name, ...stackOptions }} />
      <View className="flex flex-col w-full pl-5 bg-background-0 gap-5">
        <StatusPicker
          status={filter.status || "ALL"}
          onChange={(status) => {
            setFilter((prev) => ({ ...prev, status }));
            loadTaskWithFilter({ ...filter, status });
          }}
        />
      </View>
      <View className="flex flex-col flex-1 p-5 bg-background-0 gap-5">
        <TaskListView tasks={tasks} />
        <Button
          action="primary"
          onPress={() => {
            router.push(`/tasks/create?projectId=${projectId}`);
          }}
          size="xl"
        >
          <ButtonText>{t("tasks.actions.new_task")}</ButtonText>
        </Button>
      </View>
    </>
  );
}

export default ProjectShowScreen;
