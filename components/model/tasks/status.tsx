import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { CheckIcon } from "@/components/ui/icon";
import { TaskStatus } from "@/db/schema";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

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
  }
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
    <Badge action={action} variant={variant} size={size} className="flex flex-row gap-3">
      {selected && <BadgeIcon as={CheckIcon} size={size} className="pr-3"/>}
      <BadgeText>{t(`tasks.status.${status.toLowerCase()}`)}</BadgeText>
    </Badge>
  );
}

type StatusPickerProps = {
  status: TaskStatusFilter;
  onChange: (status: TaskStatusFilter) => void;
};

export function StatusPicker({ status, onChange }: StatusPickerProps) {
    return <View className="flex flex-row gap-3">
        {
            Object.keys(TaskStatusColors).map((name) => (
        <Pressable
            key={name}
            onPress={() =>
              onChange(name as TaskStatusFilter)
            }
          >
            <StatusBadge
              status={name as TaskStatusFilter}
              selected={name === status}
              size="xl"
            />
          </Pressable>
    ))
        }
    </View>
}

export default StatusBadge;

