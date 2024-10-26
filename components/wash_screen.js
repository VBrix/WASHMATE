import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Vibration, Alert } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { getDatabase, ref, get, update } from "firebase/database";
import { useNavigation } from "@react-navigation/native"; // To handle navigation event
import { globalStyles } from "../styles/globalStyles";

NfcManager.start();

export default function WashScreen() {
  const navigation = useNavigation(); // Hook to handle navigation events
  const [nfcSupported, setNfcSupported] = useState(true); 

  useEffect(() => {
    async function initNFC() {
      const isSupported = await NfcManager.isSupported(); // Check if NFC is supported
      setNfcSupported(isSupported);

      if (isSupported) {
        await NfcManager.start(); // Start NFC manager if supported
      } else {
        Alert.alert("NFC not supported on this device"); 
      }
    }

    initNFC();

    const unsubscribeFocus = navigation.addListener("blur", async () => {
      try {
        await NfcManager.cancelTechnologyRequest(); // Cancel NFC request on blur
      } catch (error) {
        console.log("Error cancelling NFC request:", error); 
      }
    });

    return () => {
      (async () => {
        try {
          await NfcManager.cancelTechnologyRequest(); // Cancel NFC request on component unmount
        } catch (error) {
          console.log("Error during NFC clean-up:", error); 
        }
      })();
      unsubscribeFocus(); // Unsubscribe from navigation event
    };
  }, [navigation]);

  const handleNfcScan = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef); // Request NFC technology
      const tag = await NfcManager.getTag(); // Get the NFC tag

      if (!tag || !tag.id) {
        Alert.alert("No NFC Tag detected. Try again."); // Alert if no tag is detected
        return;
      }

      const tagId = tag.id.toUpperCase().trim(); // Normalize the tag ID
      console.log("Scanned NFC Tag ID:", tagId);

      const db = getDatabase(); // Get the Firebase database instance
      const registrationRef = ref(db, `registrations/`); 

      const snapshot = await get(registrationRef); // Get the registrations snapshot
      if (!snapshot.exists()) {
        Alert.alert("No registrations found in the database."); 
        return;
      }

      const registrations = snapshot.val(); // Get the registrations data
      let found = false;

      Object.keys(registrations).forEach((key) => {
        const registeredTagId = registrations[key].id.toUpperCase().trim(); // Normalize the registered tag ID
        if (registeredTagId === tagId) {
          found = key; // Check if the scanned tag ID matches any registered tag ID
        }
      });

      if (found) {
        const registration = registrations[found];

        if (registration.status === "inactive") {
          Alert.alert("This item is inactive."); // Alert if the item is inactive
          return;
        }

        const currentWashCount = registration.currentWashCount;
        const newWashCount = currentWashCount + 1;
        const NewWashDate = new Date().toISOString(); // Get the current date in ISO format

        if (newWashCount === registration.MaxWashCount) {
          Alert.alert("This item has reached its wash limit."); // Alert if the item has reached its wash limit
          await update(ref(db, `registrations/${found}`), {
            currentWashCount: newWashCount,
            LastWashDate: NewWashDate,
            Status: "Inactive", // Mark the item as inactive
          });
        } else {
          await update(ref(db, `registrations/${found}`), {
            currentWashCount: newWashCount,
            LastWashDate: NewWashDate, // Update the wash count and last wash date
          });
        }

        Vibration.vibrate(500); // Vibrate the device to indicate success
      } else {
        Alert.alert("NFC Tag not registered."); 
      }
    } catch (ex) {
      console.warn("NFC scan failed", ex);
      Alert.alert("NFC Scan failed. Please try again."); 
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest(); // Cancel the NFC technology request
      } catch (error) {
        console.log("Error cancelling NFC request in finally block:", error); 
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      <TouchableOpacity style={globalStyles.touchable} onPress={handleNfcScan}>
        <Text style={globalStyles.touchableText}>Scan NFC Tag</Text>
      </TouchableOpacity>
    </View>
  );
}
