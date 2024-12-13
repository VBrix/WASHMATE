import { StyleSheet } from "react-native";

export const colors = {
  primary: "#6200EE", // Purple accent
  background: "#F4F5F7", // Light gray
  secondaryBackground: "#FFFFFF", // White
  text: "#1A1A1A", // Darker gray for better contrast
  touchableText: "#FFFFFF", // White for buttons
  inputBorder: "#C4C4C4", // Light gray for input borders
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
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  separator: {
    height: 1,
    backgroundColor: colors.inputBorder,
    marginVertical: 10,
  },
  
  // Typography
  titleText: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "400",
    color: colors.text,
    marginBottom: 20,
  },
  touchableText: {
    color: colors.touchableText,
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },

  // Buttons and touchable elements
  touchable: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 200, // Added fixed width
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 10,
  },

  // Input fields
  input: {
    height: 50,
    width: "100%",
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },

  // Dropdown and picker
  pickerContainer: {
    width: "100%",
    height: 50,
    marginTop: 10,
  },
  dropdown: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
});
