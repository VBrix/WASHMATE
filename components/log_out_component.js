import { Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";

// Log out function with a passed parameter "navigation" used in screens
export const LogOut = async (navigation) => {
  try {
    const auth = getAuth(); 
    if (auth) {
      await signOut(auth);
      navigation.replace("Homepage");
    } else {
      Alert.alert("Error", "Authentication is not initialized.");
    }
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};
