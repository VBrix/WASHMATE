import React, { useRef, useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Animated } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

// Import components
import { LogOut } from "../components/log_out_component";
import { ScanWashComponent } from "../components/scan_wash_component";

export default function RengøringsansvarligScreen() {
  const navigation = useNavigation();
  const borderAnim = useRef(new Animated.Value(15)).current;
  const borderWidthAnim = useRef(new Animated.Value(50)).current;
  const [borderColor, setBorderColor] = useState("transparent");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
    }
  }, []);

  // Annimation variables for the border
  const animatedStyles = {
    borderColor: borderColor,
    borderWidth: borderWidthAnim,
    borderRadius: borderAnim,
  };

  return (
    <View style={[globalStyles.container, { padding: 20 }]}>
      <Text style={[globalStyles.welcomeText, { marginBottom: 20 }]}>
        Welcome to WASHMATE, {displayName}!
      </Text>

      {/* View type for live animation*/}
      <Animated.View style={[globalStyles.container, animatedStyles, { padding: 20 }]}>
        <TouchableOpacity
          style={[globalStyles.touchable, { marginBottom: 20 }]}
          onPress={() =>
            ScanWashComponent(borderAnim, borderWidthAnim, setBorderColor)
          }
        >
          <Text style={globalStyles.touchableText}>Scan Wash</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={globalStyles.touchable}
          onPress={() => LogOut(navigation)}
        >
          <Text style={globalStyles.touchableText}>Log Out</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
