import { useProjectRepository } from "@/db/repositories";
import { Project } from "@/db/schema";
import { eventBus } from "@/utils/event-bus";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ProjectListItem from "./list-item";

type ProjectListViewProps = {
    onPress: (project: Project) => void
};

export default function ProjectListView({ onPress }: ProjectListViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const projectRepository = useProjectRepository();

  const loadProjects = () => {
    projectRepository
      .getAll()
      .then((projects) => setProjects(projects))
      .catch(console.error);
  }

  useEffect(() => {
    loadProjects();
    return eventBus.subscribe("project.created", loadProjects);
  }, []);

  return (
    <View className="flex flex-col gap-5 w-full">
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          project={project}
          onPress={() => {
            onPress(project);
          }}
        />
      ))}
    </View>
  );
}
