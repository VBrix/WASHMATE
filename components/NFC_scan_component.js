import { Alert } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

// Starting NFC technology in the mobile device
NfcManager.start();

export const NfcScanComponent = async (onTagScanned) => {
  try {
    // Await user to scan NFC tag
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();

    // If no tag is detected throw error
    if (!tag || !tag.id) {
      Alert.alert("No NFC Tag detected. Try again.");
      throw new Error("No NFC Tag detected");
    }
    
    // Normalize tag id 
    const tagId = tag.id.toUpperCase().trim();
    if (onTagScanned && typeof onTagScanned === "function") {
      await onTagScanned(tagId); 
    }
  } catch (error) {
    console.warn("NFC scan failed:", error);
    throw error; 
  } finally {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch (cancelError) {
      console.log("Error cancelling NFC request:", cancelError);
    }
  }
};
