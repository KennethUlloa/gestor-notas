import { useRef } from "react";
import { Animated, Pressable } from "react-native";

type AnimatedPressableProps = {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
};

export default function AnimatedPressable({
  children,
  className,
  onPress,
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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale }] }} className={className}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
