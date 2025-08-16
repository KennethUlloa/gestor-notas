import { TaskCreateForm } from "@/components/model/tasks";
import { AnimatedScreen } from "@/components/screen/animated";
import { useTaskRepository } from "@/db/repositories";
import { NewTask } from "@/db/schema";
import { stackOptions } from "@/utils/constants";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function CreateTaskScreen() {
  const { t } = useTranslation();
  const { projectId } = useLocalSearchParams();
  const taskRepository = useTaskRepository();

  return (
    <>
      <Stack.Screen
        options={{ title: t("tasks.page.create.title"), ...stackOptions }}
      />
      <AnimatedScreen>
        <View className="flex flex-col gap-5 p-5 bg-background-0 flex-1">
          <TaskCreateForm
            onTaskCreated={(task: NewTask) => {
              taskRepository
                .create({ ...task, projectId: projectId as string })
                .then(() => {
                  router.back();
                })
                .catch(console.error);
            }}
          />
        </View>
      </AnimatedScreen>
    </>
  );
}
