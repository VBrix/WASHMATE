import { Animated, Easing } from "react-native";


// Function to handle animation for the border when scanning NFC tag
export const animateBorder = (color, borderAnim, borderWidthAnim, setBorderColor) => {
  setBorderColor(color);

  // Interpolating the border color, width and radius
  const interpolatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [color, color],
  });

  const interpolatedBorderWidth = borderWidthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const interpolatedBorderRadius = borderWidthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  Animated.parallel([
    Animated.timing(borderAnim, {
      toValue: 0, // gør mindre
      duration: 3000, // længere annimation tid
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }),
    Animated.timing(borderWidthAnim, {
      toValue: 0, // gør mindre width mindre
      duration: 3000,
      easing: Easing.ease,
      useNativeDriver: false,
    }),
  ]).start(() => {
    // reset efter annimation
    setTimeout(() => {
      setBorderColor("transparent"); // sæt farve til transparent
      borderAnim.setValue(15); // reset Anim værdi til tidligere værdi
      borderWidthAnim.setValue(50); // width -||-
    }, 200);
  });

  // retunere interpolated værdier for at rendere 
  return {
    interpolatedBorderColor,
    interpolatedBorderWidth,
    interpolatedBorderRadius,
  };
}
