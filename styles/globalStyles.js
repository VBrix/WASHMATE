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
    padding: 5,
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
    fontSize: 24, // Increased font size
    fontWeight: "600", // Increased font weight
    color: "#000000", // Changed text color to black
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center", // Centered text
    textShadowOffset: { width: 1, height: 1 }, // Added text shadow offset
    textShadowRadius: 2, // Added text shadow radius
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


  dashboardChart: {
    marginVertical: 20,
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Buttons and touchable elements
  touchable: {
    backgroundColor: colors.primary,
    paddingVertical: 20, // Increased padding
    paddingHorizontal: 40, // Increased padding
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 250, // Increased width
  },

  scanTouchable: {
    backgroundColor: colors.primary,
    paddingVertical: 20, // Increased padding
    paddingHorizontal: 40, // Increased padding
    borderRadius: 250/2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 250, // Increased width
    height: 250, // Added height
  },

  logoutTouchable: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 250, // Added fixed width
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
    width: 250, // Adjusted width
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    fontSize: 16, // Changed font size
    color: colors.text, // Changed text color
    shadowColor: "#000", // Added shadow color
    shadowOffset: { width: 0, height: 1 }, // Reduced shadow offset
    shadowOpacity: 0.05, // Reduced shadow opacity
    shadowRadius: 2, // Reduced shadow radius
    elevation: 1, // Reduced elevation for Android shadow
  },

  // Dropdown and picker
  pickerContainer: {
    width: 250,
    height: 50,
    marginTop: 10,
  },
  dropdown: {
    position: "absolute",
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
});
