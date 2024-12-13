import { Alert, Vibration } from "react-native";
import { getDatabase, ref, get } from "firebase/database";

// import components
import { animateBorder } from "./scan_annimation_component"; 
import { NfcScanComponent } from "./NFC_scan_component"; 

export const ScanStatusComponent = async (
  borderAnim,
  borderWidthAnim,
  setBorderColor
) => {
  // Retrieve the NFC tag ID from the DB and compare it with the scanned NFC tag
  const handleTagProcessing = async (tagId) => {
    const db = getDatabase();
    const registrationRef = ref(db, "registrations/");

    const snapshot = await get(registrationRef);

    if (!snapshot.exists()) {
      Alert.alert("No registrations found in the database.");
      return;
    }

    const registrations = snapshot.val();
    let found = false;

    // Loop through the registrations to compare scanned NFC tag to the DB
    Object.keys(registrations).forEach((key) => {
      const registeredTagId = registrations[key].id.toUpperCase().trim();
      if (registeredTagId === tagId) {
        found = key;
      }
    });

    // If found run animation based on status and vibrate
    if (found) {
      const registration = registrations[found];
      if (registration.Status === "Active") {
        animateBorder("green", borderAnim, borderWidthAnim, setBorderColor);
      } else if (registration.Status === "Inactive") {
        animateBorder("red", borderAnim, borderWidthAnim, setBorderColor);
      }
      Vibration.vibrate(500);
    } else {
      Alert.alert("NFC Tag not registered.");
      animateBorder("red", borderAnim, borderWidthAnim, setBorderColor); 
    }
  };

  try {
    await NfcScanComponent(async (tagId) => {
      console.log("Scanned NFC Tag ID:", tagId);
      await handleTagProcessing(tagId);
    });
  } catch (error) {
    console.warn("NFC scan failed:", error);
    animateBorder("red", borderAnim, borderWidthAnim, setBorderColor); 
    Alert.alert("NFC Scan failed. Please try again.");
  }
};
