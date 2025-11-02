import TaskCreateForm from "@/components/model/tasks/create-form";
import SafeKeyboardScreen from "@/components/screen/safe-keyboard";
import { useTaskRepository } from "@/db/repositories";
import { NewTask } from "@/db/schema";
import { showError } from "@/hooks/toast";
import { stackOptions } from "@/models/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

function TaskCreateScreen() {
  const { t } = useTranslation();
  const { projectId, redirect } = useLocalSearchParams();
  const taskRepository = useTaskRepository();

  return (
    <>
      <Stack.Screen
        options={{ title: t("tasks.titles.create"), ...stackOptions }}
      />
      <SafeKeyboardScreen>
        <View className="flex flex-col gap-5 p-5 bg-background-0 flex-1">
          <TaskCreateForm
            onSubmit={(task: NewTask) => {
              taskRepository
                .create({ ...task, projectId: projectId as string })
                .then(() => {
                  if (redirect) {
                    // @ts-ignore
                    router.push(redirect);
                  } else {
                    router.back();
                  }
                  eventBus.emit("task.created", task);
                })
                .catch(showError);
            }}
          />
        </View>
      </SafeKeyboardScreen>
    </>
  );
}

export default TaskCreateScreen;
