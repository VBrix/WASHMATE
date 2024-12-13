import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { getDatabase, ref, push, get, query, orderByChild, equalTo } from "firebase/database";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { globalStyles, colors } from "../styles/globalStyles";

NfcManager.start();

export default function RegistrationComponent() {
  const db = getDatabase();

  // Define object of registration 
  const initialState = {
    id: "",
    createDate: "",
    currentWashCount: 0,
    MaxWashCount: "",
    LastWashDate: "",
    Status: "Active",
    Owner: "",
    ProductNumber: "",
  };

  const [newRegistration, setNewRegistration] = useState(initialState);
  const [nfcSupported, setNfcSupported] = useState(true);
  const [nfcRequesting, setNfcRequesting] = useState(false);

  // Check if device supports NFC technology
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

    return () => {
      (async () => {
        try {
          await NfcManager.cancelTechnologyRequest();
        } catch (error) {
          console.log("Error during NFC clean-up:", error);
        }
      })();
    };
  }, []);
  
  // Function to update registration based on input
  const handleInputChange = (name, value) => {
    setNewRegistration((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Checks whether the NFC tag has been registered before
  const checkIfRegistered = async (tagId) => {
    const registrationRef = ref(db, "registrations/");
    const queryRef = query(registrationRef, orderByChild("id"), equalTo(tagId));

    const snapshot = await get(queryRef);
    return snapshot.exists();
  };

  // Function to start listening for NFC tag to save new registration
  const handleNfcScanAndSave = async () => {
    try {
      if (nfcRequesting) {
        return;
      }
      // Starts listening for NFC tags 
      setNfcRequesting(true);

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (!tag || !tag.id) {
        Alert.alert("No NFC Tag detected. Try again.");
        return;
      }

      const tagId = tag.id;
      Alert.alert(`NFC Tag Found: ${tagId}`);

      // Check if tag has been registered before
      const alreadyRegistered = await checkIfRegistered(tagId);
      if (alreadyRegistered) {
        Alert.alert(
          "This tag has been scanned before and cannot be registered again."
        );
        return;
      }

      // Add id and create date to new registration object
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

  // Function to save new registration to database
  const handleSavedRegistration = async (tagId) => {
    newRegistration.createDate = new Date().toISOString();

    const {
      MaxWashCount,
      currentWashCount,
      createDate,
      LastWashDate,
      Status,
      Owner,
      ProductNumber,
    } = newRegistration;

    // Throw alert if MaxWashCount is set 0
    if (MaxWashCount === 0) {
      Alert.alert("Please enter a value for MaxWashCount.");
      return;
    }

    const registrationRef = ref(db, "registrations/");

    // Update new registration object with input values
    const newRegistrationData = {
      id: tagId,
      createDate,
      currentWashCount: parseInt(currentWashCount, 10),
      MaxWashCount: parseInt(MaxWashCount, 10),
      LastWashDate,
      Status,
      Owner,
      ProductNumber,
    };

    // Add to database /registrations
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
    <View style={[globalStyles.container, { alignItems: "stretch" }]}>
      <TextInput
        label="Max Wash Count"
        value={newRegistration.MaxWashCount}
        onChangeText={(text) => handleInputChange("MaxWashCount", text)}
        style={globalStyles.input}
        keyboardType="numeric"
        mode="outlined"
        outlineColor={colors.inputBorder}
      />

      <TextInput
        label="Product Number"
        value={newRegistration.ProductNumber}
        onChangeText={(text) => handleInputChange("ProductNumber", text)}
        style={globalStyles.input}
        mode="outlined"
        outlineColor={colors.inputBorder}
      />

      <Button
        mode="contained"
        onPress={handleNfcScanAndSave}
        style={globalStyles.button}
        labelStyle={globalStyles.touchableText}
      >
        Scan NFC Tag and Save
      </Button>
    </View>
  );
}
