import { Text, View, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function HomepageScreen({ navigation }) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.welcomeText}>Welcome to WASHMATE!</Text>
        <TouchableOpacity
          style={globalStyles.touchable}
          onPress={() => navigation.navigate('New Registration')}
        >
          <Text style={globalStyles.touchableText}>New registration</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.touchable}
          onPress={() => navigation.navigate('Scan Wash')}
        >
          <Text style={globalStyles.touchableText}>Scan wash</Text>
        </TouchableOpacity>
      </View>
    );
  }

