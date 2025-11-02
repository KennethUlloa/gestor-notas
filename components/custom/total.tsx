import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";


export function Total({ total }: { total: number }) {
  const { t } = useTranslation();
  return (
    <View className="flex flex-row gap-1 items-center">
      <Text className="text-md text-typography-900">
        {t("app.labels.total", { total: "" })}
      </Text>
      <View className="p-1 px-2 rounded-full bg-background-100">
        <Text>{total}</Text>
      </View>
    </View>
  );
}
