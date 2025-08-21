import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/icon";
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from "@/components/ui/select";
import { TaskStatus } from "@/db/schema";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

type TaskStatusFilter = TaskStatus | "ALL";

export const TaskStatusColors: Record<
  TaskStatusFilter,
  { action: "info" | "success" | "error" | "muted" }
> = {
  ALL: {
    action: "muted",
  },
  [TaskStatus.PENDING]: {
    action: "info",
  },
  [TaskStatus.COMPLETED]: {
    action: "success",
  },
  [TaskStatus.LATE]: {
    action: "error",
  },
};

type TaskStatusBadgeProps = {
  status: TaskStatusFilter;
  selected?: boolean;
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
};

function StatusBadge({
  status,
  selected,
  variant,
  size,
}: TaskStatusBadgeProps) {
  const { t } = useTranslation();
  const { action } = TaskStatusColors[status];

  return (
    <Badge
      action={action}
      variant={variant}
      size={size}
      className="flex flex-row gap-2"
    >
      {selected && <BadgeIcon as={CheckIcon} size={size} />}
      <BadgeText>{t(`tasks.status.${status.toLowerCase()}`)}</BadgeText>
    </Badge>
  );
}

type StatusPickerProps = {
  status: TaskStatusFilter;
  onChange: (status: TaskStatusFilter) => void;
};

export function StatusPicker({ status, onChange }: StatusPickerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex flex-row gap-3 justify-start py-2">
        {Object.keys(TaskStatusColors).map((name) => (
          <Pressable
            key={name}
            onPress={() => onChange(name as TaskStatusFilter)}
          >
            <StatusBadge
              status={name as TaskStatusFilter}
              selected={name === status}
              size="xl"
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

export function StatusSelect({ status, onChange }: StatusPickerProps) {
  const { t } = useTranslation();
  return (
    <Select
      selectedValue={t(`tasks.status.${status.toLowerCase()}`)}
      onValueChange={(newStatus) => onChange(newStatus as TaskStatusFilter)}
    >
      <SelectTrigger variant="outline">
        <SelectInput className="flex-1 items-center" size="xl" />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {Object.keys(TaskStatusColors).map((name) => (
            <SelectItem
              key={name}
              label={t(`tasks.status.${name.toLowerCase()}`)}
              value={name}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

export default StatusBadge;
