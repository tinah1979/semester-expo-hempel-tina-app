import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ScreenThree() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen Three</Text>
      <Text style={styles.text}>
        This screen can be used for details, settings, or additional features.
        Add content that matches your proposal.
      </Text>

      <Link href="/" style={styles.button}>
        Back to Home
      </Link>

      <Link href="/screenTwo" style={styles.button}>
        Go to Screen Two
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
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
});