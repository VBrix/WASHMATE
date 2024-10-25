import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Vibration, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native'; // To handle navigation event
import { globalStyles } from '../styles/globalStyles';


NfcManager.start();

export default function WashScreen() {
  const navigation = useNavigation();
  const [nfcSupported, setNfcSupported] = useState(true);

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

    const unsubscribeFocus = navigation.addListener('blur', async () => {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (error) {
        console.log('Error cancelling NFC request:', error);
      }
    });

    return () => {
      (async () => {
        try {
          await NfcManager.cancelTechnologyRequest();
        } catch (error) {
          console.log('Error during NFC clean-up:', error);
        }
      })();
      unsubscribeFocus();
    };
  }, [navigation]);

  const handleNfcScan = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (!tag || !tag.id) {
        Alert.alert('No NFC Tag detected. Try again.');
        return;
      }

      const tagId = tag.id.toUpperCase().trim();
      console.log("Scanned NFC Tag ID:", tagId);

      const db = getDatabase();
      const registrationRef = ref(db, `registrations/`);

      const snapshot = await get(registrationRef);
      if (!snapshot.exists()) {
        Alert.alert('No registrations found in the database.');
        return;
      }

      const registrations = snapshot.val();
      let found = false;

      Object.keys(registrations).forEach(key => {
        const registeredTagId = registrations[key].id.toUpperCase().trim();
        if (registeredTagId === tagId) {
          found = key;
        }
      });

      if (found) {
        const registration = registrations[found];

        if (registration.status === 'inactive') {
          Alert.alert('This item is inactive.');
          return;
        }

        const currentWashCount = registration.currentWashCount;
        const newWashCount = currentWashCount + 1;
        const NewWashDate = new Date().toISOString();

        if (newWashCount === registration.MaxWashCount) {
          Alert.alert('This item has reached its wash limit.');
          await update(ref(db, `registrations/${found}`), {
            currentWashCount: newWashCount,
            LastWashDate: NewWashDate,
            Status: 'Inactive',
          });
        } else {
          await update(ref(db, `registrations/${found}`), {
            currentWashCount: newWashCount,
            LastWashDate: NewWashDate,
          });
        }

        Vibration.vibrate(500);
      } else {
        Alert.alert('NFC Tag not registered.');
      }
    } catch (ex) {
      console.warn('NFC scan failed', ex);
      Alert.alert('NFC Scan failed. Please try again.');
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (error) {
        console.log('Error cancelling NFC request in finally block:', error);
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



