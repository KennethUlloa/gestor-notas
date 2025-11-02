import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";

type ColorPickerItemProps = {
  color: string;
  onPress: (color: string) => void;
  selected: boolean;
};

function ColorPickerItem({ color, onPress, selected }: ColorPickerItemProps) {
  const className =
    "w-10 h-10 rounded-lg flex flex-row items-center justify-center p-1 border border-background-300";
  return (
    <Pressable
      onPress={() => onPress(color)}
      className={className + (selected ? " border-2 border-primary-500" : "")}
    >
      <View
        className="w-full h-full rounded-md"
        style={{ backgroundColor: color }}
      ></View>
    </Pressable>
  );
}

type ColorPickerProps = {
  colors: string[];
  value?: string;
  onColorSelect: (color: string) => void;
};

export function ColorPicker({
  colors,
  onColorSelect,
  value,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    value || null
  );

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color);
  };

  useEffect(() => {
    setSelectedColor(value || null);
  }, [value]);

  return (
    <View className="flex flex-row gap-4 flex-wrap">
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

type ColorPickerInputProps = ColorPickerProps & {
  label?: string;
};

export function ColorPickerInput({
  label,
  colors,
  value,
  onColorSelect,
}: ColorPickerInputProps) {
  return (
    <FormControl>
      {label && (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      <ColorPicker value={value} colors={colors} onColorSelect={onColorSelect} />
    </FormControl>
  );
}
