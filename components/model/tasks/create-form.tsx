import DateTimeInput from "@/components/custom/datetime";
import { FieldInput, TextAreaInput } from "@/components/custom/input";
import { Button, ButtonText } from "@/components/ui/button";
import { NewTask } from "@/db/schema";
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
  const [newTask, setNewTask] = useState<CreateTask>({ dueTo: new Date() });
  const { t } = useTranslation();

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
