import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LogInComponent from "./login_screen";
import SignUpComponent from "./signup_screen";

const Tab = createBottomTabNavigator();

// Navigator for redireicting
export default function AuthScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Log ind' component={LogInComponent} />
      <Tab.Screen name='Sign up' component={SignUpComponent} />
    </Tab.Navigator>
  );
}
