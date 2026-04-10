import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecipeDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = params.title as string;
  const ingredients = params.ingredients as string;
  const instructions = params.instructions as string;
  const category = params.category as string;
  const image = params.image as string | undefined;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Recipe Details" }} />

      <Text style={styles.header}>{title}</Text>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <Text style={styles.sectionText}>{category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <Text style={styles.sectionText}>{ingredients}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.sectionText}>{instructions}</Text>
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
        <Text style={styles.homeText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F3FF" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2D2D2D",
    textAlign: "center",
  },
  image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 20 },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8, color: "#6B21A8" },
  sectionText: { fontSize: 16, color: "#2D2D2D", lineHeight: 22 },
  homeButton: { backgroundColor: "#8B5CF6", padding: 16, borderRadius: 10, marginBottom: 30 },
  homeText: { color: "white", textAlign: "center", fontSize: 18, fontWeight: "600" },
});