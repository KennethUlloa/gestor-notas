import { useRef } from "react";
import { Animated, Pressable } from "react-native";

type AnimatedPressableProps = {
  children: React.ReactNode;
  className?: string;
  style?: any;
  onPress?: () => void;
  onLongPress?: () => void;
  delayLongPress?: number;
};

export default function AnimatedPressable({
  children,
  className,
  style,
  delayLongPress = 500,
  onPress,
  onLongPress,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{ ...style, transform: [{ scale }] }}
        className={className}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
