import { FieldInput } from "@/components/custom/input";
import { Button, ButtonText } from "@/components/ui/button";
import { NewCategory } from "@/db/schema";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type CatergoyCreateFormProps = {
  onSumbit: (category: NewCategory) => void;
};

function CategoryCreateForm({ onSumbit }: CatergoyCreateFormProps) {
  const { t } = useTranslation();
  const [newCategory, setNewCategory] = useState<NewCategory>();

  return (
    <View className="flex flex-col w-full gap-5">
      <FieldInput
        type="text"
        label={t("categories.fields.name")}
        placeholder={t("categories.placeholders.name")}
        value={newCategory?.name}
        onChangeText={(text) =>
          setNewCategory({ ...(newCategory || {}), name: text })
        }
      />
      <Button
        action="primary"
        onPress={() => onSumbit(newCategory as NewCategory)}
      >
        <ButtonText>{t("app.labels.save")}</ButtonText>
      </Button>
    </View>
  );
}

export default CategoryCreateForm;
