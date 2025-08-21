import { SortItem } from "@/components/custom/sort-item";
import { TaskFilter } from "@/db/repositories";
import { SortDirection } from "@/utils/constants";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type SortFormProps = {
  filter: TaskFilter;
  onSortChange: (field: string, direction: SortDirection) => void;
};

function TaskSortForm({ filter, onSortChange }: SortFormProps) {
  const { t } = useTranslation();

  return (
    <View className="flex flex-col gap-3 w-full">
      <Text className="text-lg text-typography-900 font-semibold px-5 py-3 text-center">
        {t("app.labels.sort_by")}
      </Text>
      <SortItem
        checked={!!filter.sortBy?.createdAt}
        direction={filter.sortBy?.createdAt || SortDirection.ASC}
        field="createdAt"
        label={t("tasks.fields.created_at")}
        onSortChange={onSortChange}
      />
      <SortItem
        checked={!!filter.sortBy?.dueTo}
        direction={filter.sortBy?.dueTo || SortDirection.ASC}
        field="dueTo"
        label={t("tasks.fields.due_to")}
        onSortChange={onSortChange}
      />
      <SortItem
        checked={!!filter.sortBy?.completedAt}
        direction={filter.sortBy?.completedAt || SortDirection.ASC}
        field="completedAt"
        label={t("tasks.fields.completed_at")}
        onSortChange={onSortChange}
      />
    </View>
  );
}

export default TaskSortForm;