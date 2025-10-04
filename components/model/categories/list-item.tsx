import { Icon } from "@/components/ui/icon";
import { Tags } from "lucide-react-native";
import { Text, View } from "react-native";

type Size = "sm" | "md" | "lg";

type CategoryListItemProps = {
  name: string;
  size?: "sm" | "md" | "lg";
};

const baseClassName =
  "flex flex-row items-center bg-background-100 rounded-lg";
const textClassName = "text-typography-700";

const sizeMap: Record<Size, { text: string; padding: string }> = {
  sm: {
    text: "text-sm",
    padding: "px-1 py-0.5 gap-0.5",
  },
  md: {
    text: "text-md",
    padding: "px-2 py-1 gap-2",
  },
  lg: {
    text: "text-lg",
    padding: "px-4 py-2 gap-2",
  },
};

function categoryStyle(size?: Size) {
  const { text, padding } = sizeMap[size || "md"];
  const textStyle = `${textClassName} ${text}`;
  return {
    base: `${baseClassName} ${padding}`,
    text: textStyle,
  };
}

function CategoryListItem({ name, size }: CategoryListItemProps) {
  const { base, text } = categoryStyle(size);
  return (
    <View className={base}>
      <Icon as={Tags} className="text-typography-700" size={size} />
      <Text className={text}>{name}</Text>
    </View>
  );
}

export default CategoryListItem;
