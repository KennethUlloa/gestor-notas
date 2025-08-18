import { SortDirection } from "@/utils/constants";
import {
    ArrowDownNarrowWide,
    ArrowUpNarrowWide,
    Check,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Icon } from "../ui/icon";
import AnimatedPressable from "./animated-pressble";

type SortItemProps = {
  direction: SortDirection;
  field: string;
  label: string;
  checked?: boolean;
  onSortChange: (
    field: string,
    direction: SortDirection,
    checked?: boolean
  ) => void;
};

export function SortItem({
  direction,
  field,
  label,
  checked,
  onSortChange,
}: SortItemProps) {
  const { t } = useTranslation();
  const [dir, setDir] = useState<SortDirection>(direction);
  const [isChecked, setIsChecked] = useState(checked);

  const toggleDirection = () => {
    const newDir =
      dir === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    setDir(newDir);
    onSortChange(field, newDir, isChecked);
  };

  const toggleCheck = () => {
    setIsChecked(!isChecked);
    onSortChange(field, direction, !isChecked);
  };

  useEffect(() => {
    setDir(direction);
  }, [direction]);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <View className="w-full flex flex-row items-center gap-2">
      <AnimatedPressable
        className="flex flex-row gap-2 py-1"
        onPress={toggleCheck}
      >
        <View className="w-6 h-6">
          {isChecked && <Icon as={Check} size="md" />}
        </View>
        <Text className="text-typography-900">{label}</Text>
      </AnimatedPressable>
      {isChecked && (
        <Button
          className="ml-auto"
          onPress={toggleDirection}
          size="xs"
          variant="outline"
        >
          <ButtonIcon
            as={
              dir === SortDirection.ASC
                ? ArrowUpNarrowWide
                : ArrowDownNarrowWide
            }
          />
          <ButtonText>
            {dir === SortDirection.ASC
              ? t("app.labels.sort_dir.asc")
              : t("app.labels.sort_dir.desc")}
          </ButtonText>
        </Button>
      )}
    </View>
  );
}
