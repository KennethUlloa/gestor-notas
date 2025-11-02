import DateTimeInput from "@/components/custom/datetime";
import { FieldInput, TextAreaInput } from "@/components/custom/input";
import { SelectField } from "@/components/custom/select";
import { Button, ButtonText } from "@/components/ui/button";
import { useCategoryRepository } from "@/db/repositories";
import { Task, UpdateTask } from "@/db/schema";
import { useZodValidation } from "@/hooks/useForm";
import { dateFromNow } from "@/utils/computed-values";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { z } from "zod";

type TaskEditFormProps = {
  currentTask: Task;
  onSubmit: (id: string, task: UpdateTask) => void;
};

function TaskEditForm({ currentTask, onSubmit }: TaskEditFormProps) {
  const [updatedTask, setUpdatedTask] = useState<UpdateTask>({
    title: currentTask.title,
    content: currentTask.content,
    dueTo: currentTask.dueTo,
    categoryId: currentTask.categoryId,
  });
  const categoryRepository = useCategoryRepository();
  const { t } = useTranslation();

  const { errors, validate } = useZodValidation(
      z.object({
        title: z
          .string()
          .nonempty(t("validation.nonempty"))
          .max(80, t("validation.maxlength", { max: 80 })),
        content: z.string().max(1000, t("validation.maxlength", { max: 1000 })),
      })
    );

  const getCategories = async () => {
    const categories = await categoryRepository.getAll();
    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  };

  const handleSubmit = () => {
    if (!validate(updatedTask)) return;
    onSubmit(currentTask.id, updatedTask);
  };

  return (
    <View className="flex flex-col gap-5 w-full">
      <FieldInput
        type="text"
        label={t("tasks.fields.title")}
        value={updatedTask?.title}
        placeholder={t("tasks.placeholders.title")}
        onChangeText={(text) => setUpdatedTask({ ...updatedTask, title: text })}
        error={errors.title}
        required
      />
      <TextAreaInput
        label={t("tasks.fields.content")}
        value={updatedTask?.content || ""}
        placeholder={t("tasks.placeholders.content")}
        onChangeText={(text) => setUpdatedTask({ ...updatedTask, content: text })}
        error={errors.content}
      />
      <DateTimeInput
        label={t("tasks.fields.due_to")}
        value={updatedTask?.dueTo}
        placeholder={t("tasks.placeholders.due_to")}
        minimumDate={dateFromNow({ minutes: 10 })}
        onDateSelected={(date) => setUpdatedTask({ ...updatedTask, dueTo: date.getTime() })}
      />
      <SelectField
        label={t("tasks.fields.category")}
        value={updatedTask?.categoryId || undefined}
        placeholder={t("tasks.placeholders.category")}
        loadAsync={getCategories}
        onSelect={(value) => setUpdatedTask({ ...updatedTask, categoryId: value })}
      />
      <Button
        action="primary"
        onPress={handleSubmit}
      >
        <ButtonText>{t("app.labels.save")}</ButtonText>
      </Button>
    </View>
  );
}

export default TaskEditForm;
