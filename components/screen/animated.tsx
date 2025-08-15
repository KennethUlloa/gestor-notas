// AnimatedScreen.tsx
import React, { ReactNode, useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface AnimatedScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  duration?: number;
  slideDistance?: number;
}

export function AnimatedScreen({
  children,
  style,
  duration = 300,
  slideDistance = 50,
}: AnimatedScreenProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Animación de entrada
    progress.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateX: (1 - progress.value) * slideDistance }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
