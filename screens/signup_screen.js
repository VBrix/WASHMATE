import { Text, View, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { useState } from 'react';
import { globalStyles } from "../styles/globalStyles";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, push } from "firebase/database"; 

export default function SignUpComponent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const [userType, setUserType] = useState('')
    const [isCompleted, setCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const auth = getAuth();

    // User object for DB /Users
    const userTypes = [
        {key: '1', value: 'Rengøringsmedarbejder'},
        {key: '2', value: 'Kontrollør'},
        {key: '3', value: 'Indkøbsansvarlig'},
        {key: '4', value: 'Admin'}
    ]

    // Initializing state
    const db = getDatabase();
    const initialState = {
        email: '',
        userType: '',
        displayName: '',
        company: ''
    };

    const [userTypeData, setUserTypeData] = useState(initialState);

    // Create user in both auth and DB /Users
    const handleSubmit = async () => {
        const lowerCaseEmail = email.toLowerCase();
        await createUserWithEmailAndPassword(auth, lowerCaseEmail, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const usersRef = ref(db, "/Users/");
                const userTypeData = {
                    email: lowerCaseEmail,
                    userType,
                    displayName: name,
                    company: company
                };

                // Push user data to DB
                return push(usersRef, userTypeData)
                    .then(() => {
                        Alert.alert("Saved");
                        setUserTypeData(initialState);
                    })
                    .catch((error) => {
                        console.error(`Error: ${error.message}`);
                    })
                    .then(() => {
                        return updateProfile(user, {
                            displayName: name,
                        });
                    });
            })
            .then(() => {
                console.log("user created!");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorMessage);
            });
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.header}>Sign up</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="company"
                value={company}
                onChangeText={setCompany}
            />
            <View style={globalStyles.pickerContainer}>
                <SelectList
                    setSelected={(val) => setUserType(val)}
                    data={userTypes}
                    save="value"
                    placeholder='Select user type'
                    dropdownStyles={globalStyles.dropdown}
                    search={false} 
                    animation={{ duration: 10 }}
                />
            </View>
            {errorMessage && (
                <Text style={globalStyles.error}>Error: {errorMessage}</Text>
            )}
            <Button mode="contained" onPress={handleSubmit} style={globalStyles.button}>
                Create user
            </Button>
        </View>
    );
}
