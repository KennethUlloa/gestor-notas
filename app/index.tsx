import { ProjectCard } from "@/components/model/projects";
import { AnimatedScreen } from "@/components/screen/animated";
import { Button, ButtonText } from "@/components/ui/button";
import { useProjectRepository } from "@/db/repositories";
import { Project } from "@/db/schema";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const projects = useProjectRepository();
  const [projectList, setProjectList] = useState<Project[]>([]);

  useEffect(() => {
    projects
      .getAll()
      .then((projects) => setProjectList(projects))
      .catch(console.error);
  }, [])

  return (
    <AnimatedScreen>
      <View className="flex flex-col flex-1 p-5 items-center bg-background-0">
      <Text className="text-2xl text-typography-900 py-5 font-bold">
        Projects
      </Text>
      <Text className="text-lg text-typography-700 py-3">Manage your projects</Text>
      <View className="flex flex-col gap-5 w-full">
        {projectList.map((project) => (
        <ProjectCard key={project.id} project={project} onPress={() => {}} />
      ))}
      </View>
      <View className="mt-auto mb-5">
        <Button size="xl" onPress={() => router.push("/projects.create")}>
          <ButtonText>New Project</ButtonText>
        </Button>
      </View>
    </View>
    </AnimatedScreen>
  );
}
