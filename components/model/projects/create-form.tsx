import { ColorPickerInput } from "@/components/custom/color-picker";
import { FieldInput, TextAreaInput } from "@/components/custom/input";
import { Button, ButtonText } from "@/components/ui/button";
import { NewProject } from "@/db/schema";
import { PROJECT_COLORS } from "@/utils/constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type ProjectCreateFormProps = {
  onSubmit: (project: NewProject) => void;
};

export default function ProjectCreateForm({ onSubmit }: ProjectCreateFormProps) {
  const { t } = useTranslation();
  const [newProject, setNewProject] = useState<NewProject>({ color: PROJECT_COLORS[0] } as NewProject);

  const handleSubmit = () => {
    onSubmit(newProject);
  };
  
  return (
    <View className="flex flex-col flex-1 gap-5">
      <FieldInput
        type="text"
        label={t("projects.fields.name")}
        placeholder={t("projects.placeholders.name")}
        value={newProject.name}
        onChangeText={(text) => setNewProject({ ...newProject, name: text })}
      />
      <TextAreaInput
        label={t("projects.fields.description")}
        placeholder={t("projects.placeholders.description")}
        value={newProject.description}
        onChangeText={(text) =>
          setNewProject({ ...newProject, description: text })
        }
      />
      <ColorPickerInput
        label={t("projects.fields.color")}
        colors={PROJECT_COLORS}
        value={newProject.color}
        onColorSelect={(color) =>
          setNewProject({ ...newProject, color: color })
        }
      />
      <Button onPress={handleSubmit} action="primary">
        <ButtonText>{t("app.labels.save")}</ButtonText>
      </Button>
    </View>
  );
}
