import ProjectCreateForm from "@/components/model/projects/create-form";
import { AnimatedScreen } from "@/components/screen/animated";
import { useProjectRepository } from "@/db/repositories";
import { NewProject } from "@/db/schema";
import { showError } from "@/hooks/toast";
import { stackOptions } from "@/utils/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

function ProjectCreateScreen() {
  const projectRepository = useProjectRepository();
  const { redirect } = useLocalSearchParams();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{ ...stackOptions, title: t("projects.titles.create") }}
      />
      <AnimatedScreen>
        <View className="flex flex-col flex-1 p-5 bg-background-0">
          <Text className="text-lg text-typography-700 py-3 text-center w-full">
            {t("projects.descriptions.create")}
          </Text>
          <ProjectCreateForm
            onSubmit={(newProject: NewProject) => {
              projectRepository
                .create(newProject)
                .then(() => {
                  if (redirect) {
                    // @ts-ignore
                    router.push(redirect);
                  } else {
                    router.back();
                  }
                  eventBus.emit("project.created", newProject);
                })
                .catch(showError);
            }}
          />
        </View>
      </AnimatedScreen>
    </>
  );
}

export default ProjectCreateScreen;
