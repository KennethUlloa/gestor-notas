import { useState } from "react";
import { Pressable, View } from "react-native";

type ColorPickerItemProps = {
  color: string;
  onPress: (color: string) => void;
  selected: boolean;
};

function ColorPickerItem({ color, onPress, selected }: ColorPickerItemProps) {
    const className = "w-10 h-10 rounded-lg flex flex-row items-center justify-center p-1 border border-background-300"
  return (
    <Pressable
      onPress={() => onPress(color)}
      className={className + (selected ? " border-2 border-primary-500" : "")}
    >
        <View className="w-full h-full rounded-md" style={{ backgroundColor: color }} ></View>
    </Pressable>
  );
}

type ColorPickerProps = {
  colors: string[];
  onColorSelect: (color: string) => void;
};

export function ColorPicker({ colors, onColorSelect }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color);
  };

  return (
    <View className="flex flex-row gap-4 flex-wrap w-full justify-center">
      {colors.map((color) => (
        <ColorPickerItem
          key={color}
          color={color}
          onPress={handleColorSelect}
          selected={selectedColor === color}
        />
      ))}
    </View>
  );
}
