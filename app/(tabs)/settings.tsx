import { FieldInput } from "@/components/custom/input";
import { SelectField } from "@/components/custom/select";
import { Button, ButtonText } from "@/components/ui/button";
import { useTaskRepository } from "@/db/repositories";
import { useZodValidation } from "@/hooks/useForm";
import { stackOptions } from "@/models/constants";
import {
  DefaultSettings,
  getSettings,
  IntervalType,
  saveSettings,
} from "@/models/settings";
import { eventBus } from "@/utils/event-bus";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, ToastAndroid, View } from "react-native";
import { z } from "zod";

type SettingsForm = {
  cleanInterval: string;
  intervalType: IntervalType;
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [form, setForm] = useState<SettingsForm>(
    DefaultSettings as unknown as SettingsForm
  );

  const taskRepository = useTaskRepository();

  const { errors, validate } = useZodValidation(
    z.object({
      cleanInterval: z
        .string()
        .min(1, t("validation.nonempty")).or(z.number()),
      intervalType: z.enum(["DAYS", "WEEKS", "MONTHS"]),
    })
  );

  useEffect(() => {
    getSettings().then((settings) => {
      setForm(settings as unknown as SettingsForm);
    });
  }, []);

  const onSave = async () => {
    if (validate(form)) {
      await saveSettings({
        ...form,
        cleanInterval: Number(form.cleanInterval),
      });
      eventBus.emit("settings.updated", form);
      ToastAndroid.show(
        t("settings.messages.saved_successfully"),
        ToastAndroid.SHORT
      );
      getSettings().then((settings) => {
        setForm(settings as unknown as SettingsForm);
      });
    }
  };

  const deleteCompleted = async () => {
    await taskRepository.deleteCompleted();
    eventBus.emit("tasks.deleted", null);
    ToastAndroid.show(
      t("settings.messages.tasks_deleted"),
      ToastAndroid.SHORT
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          ...stackOptions,
          title: t("settings.title"),
        }}
      />
      <View className="w-full flex-1 bg-background-0 p-5 gap-5 flex flex-col">
        <Text className="text-lg text-typography-900 font-semibold">
          {t("settings.labels.clean_days")}
        </Text>
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <FieldInput
              type="text"
              placeholder={t("settings.placeholders.clean_days")}
              value={`${form?.cleanInterval}`}
              onChangeText={(text) => setForm({ ...form, cleanInterval: text })}
              keyboardType="numeric"
              error={errors.cleanInterval}
            />
          </View>
          <View className="flex-1">
            <SelectField
              placeholder={t("settings.placeholders.clean_unit")}
              value={form?.intervalType}
              onSelect={(value) =>
                setForm({ ...form, intervalType: value as IntervalType })
              }
              options={[
                {
                  label: t("settings.intervals.days"),
                  value: "DAYS",
                },
                {
                  label: t("settings.intervals.weeks"),
                  value: "WEEKS",
                },
                {
                  label: t("settings.intervals.months"),
                  value: "MONTHS",
                },
              ]}
            />
          </View>
        </View>
        <Button variant="outline" action="negative"  className="self-center mt-1" size="xl" onPress={deleteCompleted}>
          <ButtonText>{t("settings.actions.delete_completed")}</ButtonText>
        </Button>
        <Button className="self-center mt-auto" size="xl" onPress={onSave}>
          <ButtonText>{t("app.labels.save")}</ButtonText>
        </Button>
      </View>
    </>
  );
}
