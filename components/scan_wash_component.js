import { Alert, Vibration } from "react-native";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { animateBorder } from "./scan_annimation_component";
import { NfcScanComponent } from "./NFC_scan_component";

export const ScanWashComponent = async (
  borderAnim,
  borderWidthAnim,
  setBorderColor
) => {
  const auth = getAuth();

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
    let found = null;

    // Loop through the registrations to compare scanned NFC tag to the DB
    Object.keys(registrations).forEach((key) => {
      const registeredTagId = registrations[key].id.toUpperCase().trim();
      if (registeredTagId === tagId) {
        found = key;
      }
    });

    if (found) {
      const registration = registrations[found];

      // Check if the owner is empty and assign the current users company
      if (registration.Owner === "") {
        const currentUser = auth.currentUser;
        const usersRef = ref(db, "Users/");
        const userSnapshot = await get(usersRef);

        if (!userSnapshot.exists()) {
          Alert.alert("No Users found in the database.");
          return;
        }

        const users = userSnapshot.val();
        let foundUser = null;

        Object.keys(users).forEach((email) => {
          if (users[email].email === currentUser.email) {
            foundUser = email;
          }
        });

        const userCompany = users[foundUser]?.company || "Unknown";

        await update(ref(db, `registrations/${found}`), {
          Owner: userCompany,
        });
      }

      // If status is inactive show alert and run animation
      if (registration.status === "inactive") {
        Alert.alert("This item is inactive.");
        animateBorder("red", borderAnim, borderWidthAnim, setBorderColor);
        return;
      }

      // Increment the wash count and define the new wash date
      const currentWashCount = registration.currentWashCount || 0;
      const newWashCount = currentWashCount + 1;
      const NewWashDate = new Date().toISOString();

      // Alert if the wash count exceeds the limit
      if (newWashCount >= registration.MaxWashCount) {
        Alert.alert("This item has reached its wash limit.");
        await update(ref(db, `registrations/${found}`), {
          currentWashCount: newWashCount,
          LastWashDate: NewWashDate,
          Status: "Inactive",
        });
        animateBorder("orange", borderAnim, borderWidthAnim, setBorderColor);
      } else {
        // else update the wash count and last wash date
        await update(ref(db, `registrations/${found}`), {
          currentWashCount: newWashCount,
          LastWashDate: NewWashDate,
        });
        animateBorder("green", borderAnim, borderWidthAnim, setBorderColor);
      }
    } else {
      Alert.alert("NFC Tag not registered.");
      animateBorder("red", borderAnim, borderWidthAnim, setBorderColor);
    }
  };
  // Run the NFC scan component
  try {
    await NfcScanComponent(async (tagId) => {
      console.log("Scanned NFC Tag ID:", tagId);
      await handleTagProcessing(tagId);
    });
  } catch (error) {
    console.warn("NFC scan failed:", error);
    Alert.alert("NFC Scan failed. Please try again.");
    animateBorder("red", borderAnim, borderWidthAnim, setBorderColor);
  }
};
