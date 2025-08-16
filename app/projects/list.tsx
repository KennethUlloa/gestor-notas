import ProjectListView from "@/components/model/projects/list-view";
import { Button, ButtonText } from "@/components/ui/button";
import { stackOptions } from "@/utils/constants";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

function ProjectListScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{ title: t("projects.page.index.title"), ...stackOptions }}
      />
      <View className="flex flex-col flex-1 p-5 items-center bg-background-0">
        <Text className="text-lg text-typography-700 py-3">
          {t("projects.page.index.description")}
        </Text>
        <ProjectListView onPress={(project) => router.push(`/projects/show?projectId=${project.id}`)}/>
        <View className="mt-auto mb-5">
          <Button size="xl" onPress={() => router.push("/projects/create")}>
            <ButtonText>{t("projects.actions.new_project")}</ButtonText>
          </Button>
        </View>
      </View>
    </>
  );
}

export default ProjectListScreen;
