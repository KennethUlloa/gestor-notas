import { ColorPickerInput } from "@/components/custom/color-picker";
import { FieldInput, TextAreaInput } from "@/components/custom/input";
import { Button, ButtonText } from "@/components/ui/button";
import { useProjectRepository } from "@/db/repositories";
import { NewProject, Project, UpdateProject } from "@/db/schema";
import { useZodValidation } from "@/hooks/useForm";
import { PROJECT_COLORS } from "@/models/constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { z } from "zod";

type ProjectDataFormProps =
  | {
      project?: undefined;
      onSubmit: (project: NewProject) => void;
    }
  | {
      project: Project;
      onSubmit: (project: UpdateProject) => void;
    };

const COLORS = Object.values(PROJECT_COLORS);

export default function ProjectDataForm({
  project,
  onSubmit,
}: ProjectDataFormProps) {
  const { t } = useTranslation();
  const projectRepository = useProjectRepository();

  const { errors, validate, setError, clearError } = useZodValidation(
    z.object({
      name: z
        .string()
        .nonempty(t("validation.nonempty"))
        .max(100, t("validation.maxlength", { max: 100 })),
      description: z
        .string()
        .max(1000, t("validation.maxlength", { max: 1000 })),
      color: z.string().nonempty(t("validation.nonempty")),
    })
  );

  const [projectData, setProjectData] = useState<NewProject>({
    color: project?.color || PROJECT_COLORS.RED,
    name: project?.name || "",
    description: project?.description || "",
  } as NewProject);

  const handleSubmit = async () => {
    if (!validate(projectData)) return;
    const exists = await projectRepository.exists(projectData.name);
    if (exists) {
      setError("name", t("projects.messages.already_exists"));
    }
    onSubmit(projectData);
  };

  return (
    <View className="flex flex-col flex-1 gap-5">
      <FieldInput
        type="text"
        label={t("projects.fields.name")}
        placeholder={t("projects.placeholders.name")}
        value={projectData.name}
        onChangeText={(text) => {
          setProjectData({ ...projectData, name: text });
          clearError("name");
        }}
        error={errors.name}
        required
      />
      <TextAreaInput
        label={t("projects.fields.description")}
        placeholder={t("projects.placeholders.description")}
        value={projectData.description}
        onChangeText={(text) => {
          setProjectData({ ...projectData, description: text });
          clearError("description");
        }}
        error={errors.description}
      />
      <ColorPickerInput
        label={t("projects.fields.color")}
        colors={COLORS}
        value={projectData.color}
        onColorSelect={(color) =>
          setProjectData({ ...projectData, color: color })
        }
      />
      <Button onPress={handleSubmit} action="primary">
        <ButtonText>{t("app.labels.save")}</ButtonText>
      </Button>
    </View>
  );
}
