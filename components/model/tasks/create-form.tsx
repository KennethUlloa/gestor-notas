import DateTimeInput from "@/components/custom/datetime";
import { FieldInput, TextAreaInput } from "@/components/custom/input";
import { SelectField } from "@/components/custom/select";
import { Button, ButtonText } from "@/components/ui/button";
import { useCategoryRepository } from "@/db/repositories";
import { NewTask } from "@/db/schema";
import { dateFromNow } from "@/utils/computed-values";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type CreateTask = Partial<Omit<NewTask, "dueTo">> & {
  dueTo?: Date;
};

type TaskCreateFormProps = {
  onSubmit: (task: NewTask) => void;
};

function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const [newTask, setNewTask] = useState<CreateTask>({ dueTo: dateFromNow({ minutes: 30}) });
  const categoryRepository = useCategoryRepository();
  const { t } = useTranslation();

  const getCategories = async () => {
    const categories = await categoryRepository.getAll();
    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  };

  return (
    <View className="flex flex-col gap-5 w-full">
      <FieldInput
        type="text"
        label={t("tasks.fields.title")}
        value={newTask.title}
        placeholder={t("tasks.placeholders.title")}
        onChangeText={(text) => setNewTask({ ...newTask, title: text })}
      />
      <TextAreaInput
        label={t("tasks.fields.content")}
        value={newTask?.content || undefined}
        placeholder={t("tasks.placeholders.content")}
        onChangeText={(text) => setNewTask({ ...newTask, content: text })}
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
      <Button
        action="primary"
        onPress={() => {
          console.log("Milliseconds", newTask.dueTo?.getTime());
          onSubmit({
            ...(newTask as NewTask),
            dueTo: newTask.dueTo?.getTime(),
          });
        }}
      >
        <ButtonText>{t("app.labels.save")}</ButtonText>
      </Button>
    </View>
  );
}

export default TaskCreateForm;
