import TaskEditForm from "@/components/model/tasks/edit-form";
import SafeKeyboardScreen from "@/components/screen/safe-keyboard";
import { useTaskRepository } from "@/db/repositories";
import { Task, UpdateTask } from "@/db/schema";
import { showError } from "@/hooks/toast";
import { stackOptions } from "@/utils/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

function TaskEditScreen() {
  const { t } = useTranslation();
  const taskRepository = useTaskRepository();
  const [currentTask, setCurrentTask] = useState<Task>();
  const { id, redirect } = useLocalSearchParams();

  useEffect(() => {
    taskRepository.getById(id as string).then((task) => {
      setCurrentTask(task as Task);
    }).catch(showError);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{ title: t("tasks.titles.edit"), ...stackOptions }}
      />
      <SafeKeyboardScreen>
        <View className="flex flex-col gap-5 p-5 bg-background-0 flex-1">
          {currentTask && (
            <TaskEditForm
              currentTask={currentTask as Task}
              onSubmit={(id: string, task: UpdateTask) => {
                taskRepository
                  .update(id, task)
                  .then((task) => {
                    if (redirect) {
                      // @ts-ignore
                      router.push(redirect);
                    } else {
                      router.back();
                    }
                    eventBus.emit("task.updated", task);
                  })
                  .catch(showError);
              }}
            />
          )}
        </View>
      </SafeKeyboardScreen>
    </>
  );
}

export default TaskEditScreen;
