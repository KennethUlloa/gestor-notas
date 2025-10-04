import { SelectField, SelectOption } from "@/components/custom/select";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { TaskFilter, useCategoryRepository } from "@/db/repositories";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type TaskFilterFormProps = {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
};

function TaskFilterForm({ filter, onFilterChange }: TaskFilterFormProps) {
  const { t } = useTranslation();
  const categoryRepository = useCategoryRepository();

  return (
    <View className="flex flex-col gap-3 w-full">
      <Text className="text-lg text-typography-900 font-semibold px-5 py-3 text-center">
        {t("app.labels.filters")}
      </Text>
      <SelectField
        label={t("tasks.fields.category")}
        value={filter.categoryId!!}
        onSelect={(value) => onFilterChange({ ...filter, categoryId: value })}
        placeholder={t("tasks.placeholders.category")}
        className="w-full"
        loadAsync={async () => {
          const categories = await categoryRepository.getAll();
          return [
            ...categories.map((category) => ({
              label: category.name,
              value: category.id,
              id: category.id,
            })),
            {
              label: t("categories.labels.no_category"),
              value: null,
              id: "none",
            },
          ] as SelectOption[];
        }}
      />
      <Button
        variant="link"
        className="self-end"
        onPress={() => onFilterChange({ ...filter, categoryId: undefined })}
      >
        <ButtonIcon as={X} />
        <ButtonText>{t("app.labels.clear_filters")}</ButtonText>
      </Button>
    </View>
  );
}

export default TaskFilterForm;
