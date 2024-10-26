// globalStyles.js

import { StyleSheet } from "react-native";

export const colors = {
  primary: "#007bff", // Primary blue for touchable elements
  background: "#ffffff", // General background color
  secondaryBackground: "#f8f9fa", // Lighter background for certain screens
  text: "#333", // Standard text color
  touchableText: "#ffffff", // Text color for touchable elements
  inputBorder: "gray", // Border color for inputs
};

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  secondaryContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.secondaryBackground,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
  },

  // Text
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  touchableText: {
    color: colors.touchableText,
    fontSize: 16,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "left",
    width: "100%",
  },

  // Touchable elements
  touchable: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  // Input fields
  input: {
    height: 40,
    width: "80%",
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
