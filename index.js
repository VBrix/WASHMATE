import { AppRegistry } from 'react-native';
import App from './App'; // Imports your App.js file
import { name as appName } from './app.json'; // Imports the app name from app.json

// Registers the main component
AppRegistry.registerComponent(appName, () => App);
