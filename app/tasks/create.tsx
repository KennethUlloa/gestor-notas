import TaskCreateForm from "@/components/model/tasks/create-form";
import SafeKeyboardScreen from "@/components/screen/safe-keyboard";
import { useTaskRepository } from "@/db/repositories";
import { NewTask } from "@/db/schema";
import { stackOptions } from "@/utils/constants";
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
        options={{ title: t("tasks.page.create.title"), ...stackOptions }}
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
                .catch(console.error);
            }}
          />
        </View>
      </SafeKeyboardScreen>
    </>
  );
}

export default TaskCreateScreen;
