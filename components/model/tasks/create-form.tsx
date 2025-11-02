import DateTimeInput from "@/components/custom/datetime";
import { FieldInput, TextAreaInput } from "@/components/custom/input";
import { SelectField } from "@/components/custom/select";
import { Button, ButtonText } from "@/components/ui/button";
import { useCategoryRepository, useTaskRepository } from "@/db/repositories";
import { NewTask } from "@/db/schema";
import { useZodValidation } from "@/hooks/useForm";
import { dateFromNow } from "@/utils/computed-values";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import z from "zod";

type CreateTask = Partial<Omit<NewTask, "dueTo">> & {
  dueTo?: Date;
};

type TaskCreateFormProps = {
  onSubmit: (task: NewTask) => void;
};

function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const { t } = useTranslation();
  const taskRepository = useTaskRepository();

  const [newTask, setNewTask] = useState<CreateTask>({
    dueTo: dateFromNow({ minutes: 30 }),
    title: "",
    content: "",
  });
  const { errors, validate } = useZodValidation(
    z.object({
      title: z
        .string()
        .nonempty(t("validation.nonempty"))
        .max(80, t("validation.maxlength", { max: 80 })),
      content: z.string().max(1000, t("validation.maxlength", { max: 1000 })),
    })
  );

  const categoryRepository = useCategoryRepository();

  const getCategories = async () => {
    const categories = await categoryRepository.getAll();
    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  };

  const handleSubmit = async () => {
    if (!validate(newTask)) return;

    onSubmit({
      ...(newTask as NewTask),
      dueTo: newTask.dueTo?.getTime(),
    });
  };

  return (
    <View className="flex flex-col gap-5 w-full">
      <FieldInput
        type="text"
        label={t("tasks.fields.title")}
        value={newTask.title}
        placeholder={t("tasks.placeholders.title")}
        onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        error={errors.title}
        required
      />
      <TextAreaInput
        label={t("tasks.fields.content")}
        value={newTask?.content || undefined}
        placeholder={t("tasks.placeholders.content")}
        onChangeText={(text) => setNewTask({ ...newTask, content: text })}
        error={errors.content}
      />
      <DateTimeInput
        label={t("tasks.fields.due_to")}
        value={newTask.dueTo}
        placeholder={t("tasks.placeholders.due_to")}
        minimumDate={new Date()}
        onDateSelected={(date) => setNewTask({ ...newTask, dueTo: date })}
      />
      <SelectField
        label={t("tasks.fields.category")}
        value={newTask.categoryId || undefined}
        placeholder={t("tasks.placeholders.category")}
        loadAsync={getCategories}
        onSelect={(value) => setNewTask({ ...newTask, categoryId: value })}
      />
      <Button action="primary" onPress={handleSubmit}>
        <ButtonText>{t("app.labels.save")}</ButtonText>
      </Button>
    </View>
  );
}

export default TaskCreateForm;
