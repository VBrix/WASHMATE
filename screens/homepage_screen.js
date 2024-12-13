import { Text, View, Button, Alert } from "react-native";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";

// import user screens
import AdminScreen from "./admin_screen";
import IndkøbsansvarligScreen from "./indkøbsansvarlig_screen";
import KontrollørScreen from "./kontrollør_screen";
import RengøringsansvarligScreen from "./rengøringsmedarbejder_screen";

// Export screen
export default function HomepageScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  let auth = getAuth();

  // Universal logout function 
  const LogOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged out", "You have been logged out successfully.");
      console.log("logged out successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Chech logincred. in DB to get usertype
  useEffect(() => {
    auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const db = getDatabase();
        const usersRef = ref(db, "Users");
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          // find user basen on unique email
          const foundUser = Object.values(usersData).find(
            (u) => u.email === user.email
          );
          if (foundUser) {
            setUserData(foundUser);
          } else {
            Alert.alert("No user found with the given mail");
            LogOut();
          }
        } else {
          console.log("No data available.");
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // return screen based on usertype 
  if (user && userData) {
    if (userData.userType === "Kontrollør") {
      return <KontrollørScreen params={{ user, userData, LogOut }} />;
    } else if (userData.userType === "Rengøringsmedarbejder") {
      return <RengøringsansvarligScreen params={{ user, userData, LogOut }} />;
    } else if (userData.userType === "Indkøbsansvarlig") {
      return <IndkøbsansvarligScreen params={{ user, userData, LogOut }} />;
    } else if (userData.userType === "Admin") {
      return <AdminScreen params={{ user, userData, LogOut }} />;
    } else {
      return (
        <View style={styles.overlay}>
          <Text style={styles.header}>Unknown user type</Text>
          <Button onPress={LogOut}> Log ud</Button>
        </View>
      );
    }
  }
}
