import AnimatedPressable from "@/components/custom/animated-pressble";
import { Project } from "@/db/schema";
import { Text, View } from "react-native";

type ProjectListItemProps = {
  project: Project;
  onPress: (project: Project) => void;
};

export default function ProjectListItem({ project, onPress }: ProjectListItemProps) {
  const handlePress = () => {
    onPress(project);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      className="flex flex-row gap-4 bg-background-0 rounded-lg p-5 w-full border border-background-300"
    >
      <View
        className="w-2 h-full rounded-lg"
        style={{ backgroundColor: project.color }}
      ></View>
      <View className="flex flex-col flex-1">
        <Text className="font-bold text-typography-700 text-lg opacity-100 flex-1 text-wrap">
          {project.name}
        </Text>
        <Text className="text-typography-600 text-sm opacity-100 flex-1" numberOfLines={3} ellipsizeMode="tail">
          {project.description}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
