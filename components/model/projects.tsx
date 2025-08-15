import { Project } from "@/db/schema";
import { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { ColorPicker } from "../custom/color-picker";
import { FieldInput, TextAreaInput } from "../custom/input";
import { Button, ButtonText } from "../ui/button";

type ProjectCardProps = {
  project: Project;
  onPress: (project: Project) => void;
};

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };
  const handlePress = () => {
    onPress(project);
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="flex flex-row gap-4 bg-background-0 rounded-lg p-5 w-full border border-background-300"
      >
        <View
          className="w-2 h-full rounded-lg"
          style={{ backgroundColor: project.color }}
        ></View>
        <View className="flex flex-col">
          <Text className="font-bold text-typography-700 text-lg opacity-100">
            {project.name}
          </Text>
          <Text className="text-typography-600 text-sm opacity-100">
            {project.description}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

type ProjectCreateFormProps = {
  onFieldChange: (field: string, value: string) => void;
  onSubmit: () => void;
};

const colors = [
    "#f87171",
    "#fb9d4b",
    "#f9c74f",
    "#66b584",
    "#57c2f6",
]

export function ProjectCreateForm({
  onFieldChange,
  onSubmit,
}: ProjectCreateFormProps) {
  return (
    <View className="flex flex-col flex-1 gap-5">
      <FieldInput
        type="text"
        label="Project Name"
        placeholder="Project name"
        onChangeText={(text) => onFieldChange("name", text)}
      />
      <TextAreaInput
        label="Description"
        placeholder="Description"
        onChangeText={(text) => onFieldChange("description", text)}
      />
      <ColorPicker colors={colors} onColorSelect={(color) => onFieldChange("color", color)} />
      <Button onPress={onSubmit} action="primary">
        <ButtonText>Save</ButtonText>
      </Button>
    </View>
  );
}
