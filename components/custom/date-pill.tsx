import formatters from "@/utils/formatters";
import { CalendarDays } from "lucide-react-native";
import { Text, View } from "react-native";
import { Icon } from "../ui/icon";

type DatePillProps = {
  date?: Date | number | string | null;
  label: string;
};

export function DatePill({ date, label }: DatePillProps) {
  return (
    <View className="flex flex-column gap-1 items-start">
      <View className="flex flex-row gap-1 items-center">
        <Icon as={CalendarDays} className="text-typography-700" size="sm" />
        <Text className="text-sm text-typography-700">{label}</Text>
      </View>
      <Text className="text-md text-typography-800 font-semibold">
        {formatters.dateTime(date ?? undefined)}
      </Text>
    </View>
  );
}
