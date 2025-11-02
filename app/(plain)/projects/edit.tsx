import ProjectDataForm from "@/components/model/projects/data-form";
import { AnimatedScreen } from "@/components/screen/animated";
import { useProjectRepository } from "@/db/repositories";
import { Project, UpdateProject } from "@/db/schema";
import { stackOptions } from "@/models/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

function ProjectCreateScreen() {
  const projectRepository = useProjectRepository();
  const { redirect, id } = useLocalSearchParams();
  const { t } = useTranslation();

  const [project, setProject] = useState<Project>();

  useEffect(() => {
    if (id) {
      projectRepository
        .getById(id as string)
        .then((project) => setProject(project));
    }
  }, [id]);

  return (
    <>
      <Stack.Screen
        options={{ ...stackOptions, title: t("projects.titles.edit") }}
      />
      <AnimatedScreen>
        <View className="flex flex-col flex-1 p-5 bg-background-0">
          <Text className="text-lg text-typography-700 py-3 text-center w-full">
            {t("projects.descriptions.edit")}
          </Text>
          {project && (
            <ProjectDataForm
              project={project}
              onSubmit={(updatedProject: UpdateProject) => {
                projectRepository.update(id as string, updatedProject).then(() => {
                  if (redirect) {
                    // @ts-ignore
                    router.push(redirect);
                  } else {
                    router.back();
                  }
                  eventBus.emit("project.updated", updatedProject);
                });
              }}
            />
          )}
        </View>
      </AnimatedScreen>
    </>
  );
}

export default ProjectCreateScreen;
