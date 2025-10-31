import { FieldInput } from "@/components/custom/input";
import { SelectField } from "@/components/custom/select";
import { Button, ButtonText } from "@/components/ui/button";
import { useSettingsRepository } from "@/db/repositories";
import { IntervalUnit, SettingsKeys } from "@/db/schema";
import { stackOptions } from "@/utils/constants";
import { eventBus } from "@/utils/event-bus";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type SettingsForm = {
  cleanDays?: string;
  cleanDaysUnit?: IntervalUnit;
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [form, setForm] = useState<SettingsForm>({});
  const settings = useSettingsRepository();

  useEffect(() => {
    settings.getAll().then((stt) => {
        console.log(stt);
      setForm({
        cleanDays: stt.find((s) => s.name === SettingsKeys.CLEAN_UP_INTERVAL)
          ?.value,
        cleanDaysUnit: stt.find(
          (s) => s.name === SettingsKeys.CLEAN_UP_INTERVAL_UNIT
        )?.value as IntervalUnit,
      });
    });
  }, []);

  const onSave = async () => {
    if (form?.cleanDays && form?.cleanDaysUnit) {
      await settings.setValue(SettingsKeys.CLEAN_UP_INTERVAL, form.cleanDays);
      await settings.setValue(
        SettingsKeys.CLEAN_UP_INTERVAL_UNIT,
        form.cleanDaysUnit
      );
      eventBus.emit("settings.updated", form);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          ...stackOptions,
          title: t("settings.title"),
        }}
      />
      <View className="w-full flex-1 bg-background-0 p-5 gap-5 flex flex-col">
        <FieldInput
          type="text"
          label={t("settings.labels.clean_days")}
          placeholder={t("settings.placeholders.clean_days")}
          value={form?.cleanDays}
          onChangeText={(text) => setForm({ ...form, cleanDays: text })}
          keyboardType="numeric"
        />
        <SelectField
          label={t("settings.labels.clean_unit")}
          placeholder={t("settings.placeholders.clean_unit")}
          value={form?.cleanDaysUnit as IntervalUnit}
          onSelect={(value) =>
            setForm({ ...form, cleanDaysUnit: value as IntervalUnit })
          }
          options={[
            {
              label: t("settings.intervals.days"),
              value: IntervalUnit.DAYS,
            },
            {
              label: t("settings.intervals.weeks"),
              value: IntervalUnit.WEEKS,
            },
            {
              label: t("settings.intervals.months"),
              value: IntervalUnit.MONTHS,
            },
          ]}
        />
        <Button className="self-center mt-auto" size="xl" onPress={onSave}>
          <ButtonText>{t("app.labels.save")}</ButtonText>
        </Button>
      </View>
    </>
  );
}
