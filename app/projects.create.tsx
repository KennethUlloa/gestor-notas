import { ProjectCreateForm } from "@/components/model/projects";
import { AnimatedScreen } from "@/components/screen/animated";
import { useProjectRepository } from "@/db/repositories";
import { NewProject } from "@/db/schema";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

function CreateProjectScreen() {
  const projectRepository = useProjectRepository();
  const router = useRouter();
  const [projectData, setProjectData] = useState<NewProject>({} as NewProject);
  return (
    <AnimatedScreen>
      <View className="flex flex-col flex-1 p-5 bg-background-0">
        <Text className="text-2xl text-typography-900 py-5 font-bold text-center w-full">New Project</Text>
        <Text className="text-lg text-typography-700 py-3 text-center w-full">Create a new project to get started</Text>
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
  );
}

export default CreateProjectScreen;
