import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { getApps, initializeApp } from "firebase/app";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context"; // Import SafeAreaProvider

import DashboardScreen from "./components/dashboard_screen";
import HomepageScreen from "./components/homepage_screen";
import RegistrationScreen from "./components/registration_screen";
import WashScreen from "./components/wash_screen";
import RegistrationGuideScreen from "./components/registrationGuide_screen";

enableScreens();

const firebaseConfig = {
  apiKey: "AIzaSyBfp-lh5IiQWONkrK-iG4j8rTRmf4AChb0",
  authDomain: "intgk1.firebaseapp.com",
  databaseURL: "https://intgk1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "intgk1",
  storageBucket: "intgk1.appspot.com",
  messagingSenderId: "466408583193",
  appId: "1:466408583193:web:437b3dd480fdcbac2eba88",
};

export default function App() {
  if (getApps().length < 1) {
    initializeApp(firebaseConfig);
    console.log("Firebase On!");
  }

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const StackNavigation = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='Homepage'
          component={HomepageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='New Registration'
          component={RegistrationScreen}
          options={{
            headerTitle: "", // Hide title, keep back arrow
            headerLeftContainerStyle: { paddingLeft: 20, paddingTop: 100 },
            headerTintColor: "#000",
          }}
        />
        <Stack.Screen
          name='Scan Wash'
          component={WashScreen}
          options={{
            headerTitle: "", // Hide title, keep back arrow
            headerLeftContainerStyle: { paddingLeft: 20, paddingTop: 100 },
            headerTintColor: "#000",
          }}
        />
        <Stack.Screen
          name='Registration Guide'
          component={RegistrationGuideScreen}
          options={{
            headerTitle: "", // Hide title, keep back arrow
            headerLeftContainerStyle: { paddingLeft: 20, paddingTop: 100 },
            headerTintColor: "#000",
          }}
        />
      </Stack.Navigator>
    );
  };

  const TabNavigation = () => {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name={"Home"}
              component={StackNavigation}
              options={{ headerShown: null }}
            />
            <Tab.Screen
              name={"Dashboard"}
              component={DashboardScreen}
              options={{ headerTitle: "", headerTransparent: true }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  };

  return <TabNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
