import { View } from "react-native";

type CategoryListItemProps = {
    name: string;
}

function CategoryListItem({ name }: CategoryListItemProps) {
    return <View className="flex flex-row gap-2 items-center p-5 border border-background-300">
        {name}
    </View>
}

export default CategoryListItem;