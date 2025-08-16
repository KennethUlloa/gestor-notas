import { TaskListView } from "@/components/model/tasks";
import { AnimatedScreen } from "@/components/screen/animated";
import { Button, ButtonText } from "@/components/ui/button";
import { useProjectRepository } from "@/db/repositories";
import { Project } from "@/db/schema";
import { stackOptions } from "@/utils/constants";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function ProjectsView() {
  const { t } = useTranslation();
  const { projectId } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const projectRepository = useProjectRepository();

  useEffect(() => {
    projectRepository
      .getById(projectId as string)
      .then((project) => setProject(project as Project))
      .catch(console.error);
  }, []);

  return (
    <>
    <Stack.Screen
        options={{ title: project?.name, ...stackOptions }}
      />
      <AnimatedScreen>
        <View className="flex flex-col flex-1 p-5 bg-background-0 gap-5">
          <TaskListView projectId={projectId as string} />
          <Button
            action="primary"
            onPress={() => {
              router.push(`/tasks.create?projectId=${projectId}`);
            }}
            size="xl"
          >
            <ButtonText>{t("tasks.actions.new_task")}</ButtonText>
          </Button>
        </View>
      </AnimatedScreen>
    </>
  );
}
