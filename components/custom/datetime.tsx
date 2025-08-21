import React, { useState } from "react";

import i18n from "@/i18n";
import { dateFromNow } from "@/utils/computed-values";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Pressable, Text } from "react-native";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { CalendarDaysIcon, Icon } from "../ui/icon";

type DatePickerFieldProps = {
  value?: Date | number | string;
  onDateSelected: (date: Date) => void;
  label?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: string;
  disabled?: boolean;
};

export default function DateTimeInput({
  value,
  onDateSelected,
  label,
  placeholder,
  minimumDate,
  maximumDate,
  locale = i18n.language,
  disabled = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"date" | "time" | "datetime">("date");

  const handleDatePress = () => {
    setOpen(true);
  };

  const date = value ? new Date(value) : dateFromNow({ minutes: 10 });

  const handleDateSelected = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed") {
      setMode("date");
      setOpen(false);
      return;
    }

    onDateSelected(date || new Date());

    if (mode === "date") {
      setMode("time");
      return;
    } else {
      setMode("date");
      setOpen(false);
    }
  };

  return (
    <>
      <FormControl focusable={false}>
        {label && (
          <FormControlLabel>
            <FormControlLabelText>{label}</FormControlLabelText>
          </FormControlLabel>
        )}
        <Pressable
          onPress={handleDatePress}
          className="px-3 py-2 flex flex-row gap-3 items-center border border-background-300 rounded-md focus:border-primary-700 active:border-primary-700 peer-active:border-primary-700"
          focusable
        >
          <Text className={`flex-1 text-typography-${!value ? "500" : "900"}`}>
            {date ? date.toLocaleString() : placeholder}
          </Text>
          <Icon as={CalendarDaysIcon} />
        </Pressable>
      </FormControl>
      {open && (
        <DateTimePicker
          mode={mode}
          value={date}
          onChange={handleDateSelected}
          disabled={disabled}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          locale={locale}
        />
      )}
    </>
  );
}
