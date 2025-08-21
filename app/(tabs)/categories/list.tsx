import CategoryListItem from "@/components/model/categories/list-item";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useCategoryRepository } from "@/db/repositories";
import { Category } from "@/db/schema";
import { stackOptions } from "@/utils/constants";
import { eventBus } from "@/utils/event-bus";
import { router, Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

function CategoryListScreen() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const categoryRepository = useCategoryRepository();

  useEffect(() => {
    categoryRepository.getAll().then(setCategories);
  }, []);

  useEffect(() => {
    return eventBus.subscribe("category.created", () => {
      categoryRepository.getAll().then(setCategories);
    });
  }, []);

  return (
    <>
      <Stack.Screen
        options={{ title: t("categories.titles.list"), ...stackOptions }}
      />
      <View className="flex-1 bg-background-0 p-5 flex flex-col gap-5">
        <Text className="text-lg text-typography-700 py-3 text-center">
          {t("categories.descriptions.list")}
        </Text>
        <View className="flex flex-col gap-5">
          {categories.length === 0 && (
            <Text className="text-xl text-typography-600 text-center">
              {t("categories.messages.no_categories")}
            </Text>
          )}
          {categories.length > 0 && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="flex flex-row gap-3 flex-wrap justify-start">
              {categories.map((category) => (
                <CategoryListItem key={category.id} name={category.name} size="lg" />
              ))}
            </ScrollView>
          )}
        </View>
        <Button
          action="primary"
          size="xl"
          className="mb-5 self-center mt-auto"
          onPress={() => {
            router.push("/categories/create");
          }}
        >
          <ButtonIcon as={Plus} />
          <ButtonText>{t("categories.actions.new_category")}</ButtonText>
        </Button>
      </View>
    </>
  );
}

export default CategoryListScreen;
