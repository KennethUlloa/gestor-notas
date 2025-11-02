import CategoryCreateForm from "@/components/model/categories/create-form";
import { useCategoryRepository } from "@/db/repositories";
import { stackOptions } from "@/models/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

function CategoryCreateScreen() {
  const { t } = useTranslation();
  const categoryRepository = useCategoryRepository();

  return (
    <>
      <Stack.Screen
        options={{ title: t("categories.titles.create"), ...stackOptions }}
      />
      <View className="flex flex-col flex-1 p-5 items-center bg-background-0">
        <CategoryCreateForm
          onSumbit={(newCategory) => {
            categoryRepository.create(newCategory).then(() => {
              eventBus.emit("category.created", newCategory);
              router.back();
            });
          }}
        />
      </View>
    </>
  );
}

export default CategoryCreateScreen;
