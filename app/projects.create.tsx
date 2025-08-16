import { ProjectCreateForm } from "@/components/model/projects";
import { AnimatedScreen } from "@/components/screen/animated";
import { useProjectRepository } from "@/db/repositories";
import { NewProject } from "@/db/schema";
import { stackOptions } from "@/utils/constants";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

function CreateProjectScreen() {
  const projectRepository = useProjectRepository();
  const [projectData, setProjectData] = useState<NewProject>({} as NewProject);
  const { t } = useTranslation();
  return (
    <>
    <Stack.Screen
        options={{ ...stackOptions, title: t("projects.page.create.title")}}
      />
    <AnimatedScreen>
      <View className="flex flex-col flex-1 p-5 bg-background-0">
        <Text className="text-lg text-typography-700 py-3 text-center w-full">{t("projects.page.create.description")}</Text>
        <ProjectCreateForm
          onFieldChange={(field, value) =>
            setProjectData((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={() => {
            projectRepository
              .create(projectData)
              .then(() => {
                router.replace("/");
              })
              .catch(console.error);
          }}
        />

      </View>
    </AnimatedScreen>
    </>
  );
}

export default CreateProjectScreen;
