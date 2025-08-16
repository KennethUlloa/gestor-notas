import ProjectCreateForm from "@/components/model/projects/create-form";
import { AnimatedScreen } from "@/components/screen/animated";
import { useProjectRepository } from "@/db/repositories";
import { NewProject } from "@/db/schema";
import useEventStore from "@/store/events";
import { stackOptions } from "@/utils/constants";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

function ProjectCreateScreen() {
  const projectRepository = useProjectRepository();
  const { redirect } = useLocalSearchParams();
  const { t } = useTranslation();
  const send = useEventStore((state) => state.send);

  return (
    <>
      <Stack.Screen
        options={{ ...stackOptions, title: t("projects.page.create.title") }}
      />
      <AnimatedScreen>
        <View className="flex flex-col flex-1 p-5 bg-background-0">
          <Text className="text-lg text-typography-700 py-3 text-center w-full">
            {t("projects.page.create.description")}
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
                  send({ name: "project.created", data: newProject });
                })
                .catch(console.error);
            }}
          />
        </View>
      </AnimatedScreen>
    </>
  );
}

export default ProjectCreateScreen;
