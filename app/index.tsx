import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My App</Text>
      <Text style={styles.text}>
        This is the Home screen. Use the buttons below to navigate to other
        screens in the app.
      </Text>

      <Link href="/screenTwo" style={styles.button}>
        Go to Screen Two
      </Link>

      <Link href="/screenThree" style={styles.button}>
        Go to Screen Three
      </Link>

      <Link href="/modal" style={styles.buttonAlt}>
        Open Modal Screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 30 },
  button: {
    padding: 14,
    backgroundColor: "#4a90e2",
    color: "white",
    textAlign: "center",
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonAlt: {
    padding: 14,
    backgroundColor: "#50b36b",
    color: "white",
    textAlign: "center",
    borderRadius: 8,
    marginTop: 10,
    fontSize: 16,
  },
});