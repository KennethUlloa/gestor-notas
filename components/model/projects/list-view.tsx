import { useProjectRepository } from "@/db/repositories";
import { Project } from "@/db/schema";
import useEventStore from "@/store/events";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ProjectListItem from "./list-item";

type ProjectListViewProps = {
    onPress: (project: Project) => void
};

export default function ProjectListView({ onPress }: ProjectListViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const projectRepository = useProjectRepository();
  const event = useEventStore((state) => state.event);

  useEffect(() => {
    if (event?.name === "project.created") {
      loadProjects();
    }
  }, [event]);

  const loadProjects = () => {
    projectRepository
      .getAll()
      .then((projects) => setProjects(projects))
      .catch(console.error);
  }

  useEffect(() => {
    loadProjects();
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
