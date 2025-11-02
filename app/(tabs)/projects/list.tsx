import ProjectListView from "@/components/model/projects/list-view";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { stackOptions } from "@/models/constants";
import { router, Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

function ProjectListScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen
        options={{ title: t("projects.titles.list"), ...stackOptions }}
      />
      <View className="flex flex-col flex-1 p-5 items-center bg-background-0">
        <Text className="text-lg text-typography-700 pb-5 text-center">
          {t("projects.descriptions.list")}
        </Text>

        <ProjectListView
          onPress={(project) =>
            router.push({
              pathname: "/(plain)/projects/show",
              params: { projectId: project.id },
            })
          }
        />
        <View className="mt-auto py-5">
          <Button
            size="xl"
            onPress={() => router.push("/(plain)/projects/create")}
          >
            <ButtonIcon size="xl" as={Plus} />
            <ButtonText>{t("projects.actions.new_project")}</ButtonText>
          </Button>
        </View>
      </View>
    </>
  );
}

export default ProjectListScreen;
