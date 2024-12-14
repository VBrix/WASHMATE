import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from 'react-native';

import LogInComponent from "./login_screen";
import SignUpComponent from "./signup_screen";

const Tab = createBottomTabNavigator();

// Navigator for redireicting
export default function AuthScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name='Log ind' 
        component={LogInComponent} 
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/login.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen 
        name='Sign up' 
        component={SignUpComponent} 
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/signup.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
