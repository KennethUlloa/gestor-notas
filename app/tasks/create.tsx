import TaskCreateForm from "@/components/model/tasks/create-form";
import { useTaskRepository } from "@/db/repositories";
import { NewTask } from "@/db/schema";
import useEventStore from "@/store/events";
import { stackOptions } from "@/utils/constants";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

function TaskCreateScreen() {
  const { t } = useTranslation();
  const { projectId, redirect } = useLocalSearchParams();
  const taskRepository = useTaskRepository();
  const send = useEventStore((state) => state.send);

  return (
    <>
      <Stack.Screen
        options={{ title: t("tasks.page.create.title"), ...stackOptions }}
      />

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
                send({ name: "task.created", data: task });
              })
              .catch(console.error);
          }}
        />
      </View>
    </>
  );
}

export default TaskCreateScreen;
