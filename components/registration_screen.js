import { Alert, TextInput, View, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  getDatabase,
  ref,
  push,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { globalStyles } from "../styles/globalStyles";

NfcManager.start();

export default function RegistrationScreen() {
  const db = getDatabase();
  const navigation = useNavigation();

  const initialState = {
    id: "",
    createDate: "",
    currentWashCount: 0,
    MaxWashCount: 0,
    LastWashDate: "",
    Status: "Active",
  };

  const [newRegistration, setNewRegistration] = useState(initialState);
  const [nfcSupported, setNfcSupported] = useState(true);
  const [nfcRequesting, setNfcRequesting] = useState(false);

  useEffect(() => {
    async function initNFC() {
      const isSupported = await NfcManager.isSupported();
      setNfcSupported(isSupported);

      if (isSupported) {
        await NfcManager.start();
      } else {
        Alert.alert("NFC not supported on this device");
      }
    }

    initNFC();

    const unsubscribeFocus = navigation.addListener("blur", async () => {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (error) {
        console.log("Error cancelling NFC request:", error);
      }
    });

    return () => {
      (async () => {
        try {
          await NfcManager.cancelTechnologyRequest();
        } catch (error) {
          console.log("Error during NFC clean-up:", error);
        }
      })();

      unsubscribeFocus();
    };
  }, [navigation]);

  const handleInputChange = (name, value) => {
    setNewRegistration((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const checkIfRegistered = async (tagId) => {
    const registrationRef = ref(db, "registrations/");
    const queryRef = query(registrationRef, orderByChild("id"), equalTo(tagId));

    const snapshot = await get(queryRef);
    return snapshot.exists();
  };

  const handleNfcScanAndSave = async () => {
    try {
      if (nfcRequesting) {
        return;
      }

      setNfcRequesting(true);

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (!tag || !tag.id) {
        Alert.alert("No NFC Tag detected. Try again.");
        return;
      }

      const tagId = tag.id;
      Alert.alert(`NFC Tag Found: ${tagId}`);

      const alreadyRegistered = await checkIfRegistered(tagId);

      if (alreadyRegistered) {
        Alert.alert(
          "This tag has been scanned before and cannot be registered again."
        );
        return;
      }

      setNewRegistration((prevState) => ({
        ...prevState,
        id: tagId,
        createDate: new Date().toISOString(),
      }));

      await handleSavedRegistration(tagId);
    } catch (ex) {
      console.warn("NFC scan failed", ex);
      Alert.alert("NFC Scan failed. Please try again.");
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (error) {
        console.log("Error cancelling NFC request in finally block:", error);
      } finally {
        setNfcRequesting(false);
      }
    }
  };

  const handleSavedRegistration = async (tagId) => {
    newRegistration.createDate = new Date().toISOString();

    const { MaxWashCount, currentWashCount, createDate, LastWashDate, Status } =
      newRegistration;

    if (MaxWashCount === 0) {
      Alert.alert("Please enter a value for MaxWashCount.");
      return;
    }

    const registrationRef = ref(db, "registrations/");

    const newRegistrationData = {
      id: tagId,
      createDate,
      currentWashCount: parseInt(currentWashCount, 10),
      MaxWashCount: parseInt(MaxWashCount, 10),
      LastWashDate,
      Status,
    };

    await push(registrationRef, newRegistrationData)
      .then(() => {
        Alert.alert("New item successfully added to the database!");
        setNewRegistration(initialState);
      })
      .catch((error) => {
        Alert.alert(`Error: ${error.message}`);
      });
  };

  return (
    <View style={globalStyles.container}>
      <TextInput
        placeholder='Enter Max Wash Count'
        value={newRegistration.MaxWashCount.toString()}
        onChangeText={(text) => handleInputChange("MaxWashCount", text)}
        style={globalStyles.input}
        keyboardType='numeric'
      />

      <TouchableOpacity
        style={globalStyles.touchable}
        onPress={handleNfcScanAndSave}
      >
        <Text style={globalStyles.touchableText}>Scan NFC Tag and Save</Text>
      </TouchableOpacity>

      {/* New Button to Navigate to Registration Guide Screen */}
      <TouchableOpacity
        style={globalStyles.touchable}
        onPress={() => navigation.navigate("Registration Guide")}
      >
        <Text style={globalStyles.touchableText}>Go to Registration Guide</Text>
      </TouchableOpacity>
    </View>
  );
}
