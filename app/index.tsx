import { ProjectCard } from "@/components/model/projects";
import { AnimatedScreen } from "@/components/screen/animated";
import { Button, ButtonText } from "@/components/ui/button";
import { useProjectRepository } from "@/db/repositories";
import { Project } from "@/db/schema";
import { stackOptions } from "@/utils/constants";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const projects = useProjectRepository();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    projects
      .getAll()
      .then((projects) => setProjectList(projects))
      .catch(console.error);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{ title: t("projects.page.index.title"), ...stackOptions }}
      />
      <AnimatedScreen>
        <View className="flex flex-col flex-1 p-5 items-center bg-background-0">
          <Text className="text-lg text-typography-700 py-3">
            {t("projects.page.index.description")}
          </Text>
          <View className="flex flex-col gap-5 w-full">
            {projectList.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => {
                  router.push(`/projects.view?projectId=${project.id}`);
                }}
              />
            ))}
          </View>
          <View className="mt-auto mb-5">
            <Button size="xl" onPress={() => router.push("/projects.create")}>
              <ButtonText>{t("projects.actions.new_project")}</ButtonText>
            </Button>
          </View>
        </View>
      </AnimatedScreen>
    </>
  );
}
