import { Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { useState, useLayoutEffect} from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { globalStyles } from "../styles/globalStyles";
import { useNavigation } from '@react-navigation/native';

export default function LogInComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCompleted, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const auth = getAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
    });
  }, [navigation]);

  // Function to log-in using auth
  const handleSubmit = async ({ navigation }) => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // set user globally and navigate to homepage
        const user = userCredential.user;
        console.log("user logged in:", user.displayName, user.email);
        navigation.navigate("Homepage");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode, errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={globalStyles.container}>
          <Text style={globalStyles.header}>Log ind</Text>
          <TextInput
            style={globalStyles.input}
            placeholder='email'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={globalStyles.input}
            placeholder='password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          {errorMessage && <Text style={globalStyles.error}>Error: {errorMessage}</Text>}
          <TouchableOpacity
            style={[globalStyles.touchable, { marginTop: 20 }]}
            onPress={handleSubmit}
          >
            <Text style={globalStyles.touchableText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}