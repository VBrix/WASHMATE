import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

// Import components
import RegistrationComponent from "../components/scan_registration_component";
import { LogOut } from "../components/log_out_component";

export default function AdminScreen() {
  const navigation = useNavigation();
  const [auth, setAuth] = useState(null);
  const [displayName, setDisplayName] = useState("");

  // get user from auth DB
  useEffect(() => {
    const auth = getAuth();
    setAuth(auth);
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[globalStyles.container, { padding: 20, justifyContent: "space-between" }]}>
          <Text style={[globalStyles.welcomeText, { marginBottom: 20 }]}>
            Welcome to <Text style={{ color: "rgb(132, 189, 57)" }}>WASH</Text><Text style={{ color: "#000" }}>MATE</Text>, {displayName}!
          </Text>

          <View style={{ flex: 1, justifyContent: "center" }}>
            <RegistrationComponent />
          </View>

          <View>
            <TouchableOpacity
              style={[globalStyles.logoutTouchable, { marginBottom: 20 }]}
              onPress={() => LogOut(navigation)}
            >
              <Text style={globalStyles.touchableText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
