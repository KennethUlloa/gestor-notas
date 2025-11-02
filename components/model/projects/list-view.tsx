import {
  ItemOptions,
  useItemOptions,
} from "@/components/actionsheet/item-options";
import { Total } from "@/components/custom/total";
import { useProjectRepository } from "@/db/repositories";
import { Project } from "@/db/schema";
import { showError } from "@/hooks/toast";
import { eventBus } from "@/utils/event-bus";
import { router } from "expo-router";
import { Edit, Trash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import ProjectListItem from "./list-item";

type ProjectListViewProps = {
  onPress: (project: Project) => void;
};

export default function ProjectListView({ onPress }: ProjectListViewProps) {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const projectRepository = useProjectRepository();
  const itemOptions = useItemOptions();

  const loadProjects = () => {
    projectRepository
      .getAll()
      .then((projects) => setProjects(projects))
      .catch(showError);
  };

  useEffect(() => {
    loadProjects();
    const subscriptions = [
      eventBus.subscribe("project.created", loadProjects),
      eventBus.subscribe("project.updated", loadProjects),
      eventBus.subscribe("project.deleted", loadProjects),
    ];

    return () => {
      subscriptions.forEach((clear) => clear());
    };
  }, []);

  const handleLongPress = (project: Project) => {
    itemOptions.show([
      {
        id: "edit",
        label: t("projects.actions.edit_project"),
        icon: Edit,
        textClassName: "text-lg",
        onPress: () => {
          router.push({
            pathname: "/(plain)/projects/edit",
            params: { id: project.id },
          });
        },
      },
      {
        id: "delete",
        label: t("projects.actions.delete_project"),
        icon: Trash,
        textClassName: "text-red-500 text-lg",
        iconClassName: "text-red-500",
        onPress: async () => {
          await projectRepository.delete(project.id);
          eventBus.emit("project.deleted", project);
        },
      },
    ]);
  };

  return (
    <>
      <View className="flex flex-row mb-3">
        <Total total={projects.length || 0} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        <View className="flex flex-col gap-5 w-full">
          {projects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onPress={() => {
                onPress(project);
              }}
              onLongPress={handleLongPress}
            />
          ))}
        </View>
      </ScrollView>
      <ItemOptions {...itemOptions} />
    </>
  );
}
