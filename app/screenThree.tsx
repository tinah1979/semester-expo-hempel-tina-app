import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScreenThree() {
  const router = useRouter();

  // get recipe info from home screen
  const { title, category, ingredients, instructions, image, index } =
    useLocalSearchParams();

  // delete recipe
  const deleteRecipe = async () => {
    Alert.alert("Delete Recipe", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const saved = await AsyncStorage.getItem("recipes_v2");
            if (saved) {
              const list = JSON.parse(saved);
              list.splice(Number(index), 1); // remove recipe
              await AsyncStorage.setItem("recipes_v2", JSON.stringify(list));
            }
            router.back();
          } catch (err) {
            console.log("delete error:", err);
          }
        },
      },
    ]);
  };

  // edit recipe → send back to screen two
  const editRecipe = () => {
    router.push({
      pathname: "/screenTwo",
      params: {
        title,
        category,
        ingredients,
        instructions,
        image,
        index,
      },
    });
  };

  // split ingredients into bullet list
  const ingredientList = String(ingredients)
    .split("\n")
    .filter((line) => line.trim() !== "");

  // split instructions into numbered steps
  const instructionList = String(instructions)
    .split("\n")
    .filter((line) => line.trim() !== "");

  return (
    <ScrollView style={styles.container}>
      {/* recipe title */}
      <Text style={styles.header}>{title}</Text>

      {/* recipe image */}
      {image && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: String(image) }} style={styles.image} />
        </View>
      )}

      {/* recipe category */}
      <Text style={styles.category}>{category}</Text>

      {/* ingredients section */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {ingredientList.map((item, i) => (
        <Text key={i} style={styles.bodyText}>
          • {item}
        </Text>
      ))}

      {/* instructions section */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      {instructionList.map((step, i) => (
        <Text key={i} style={styles.bodyText}>
          {i + 1}. {step}
        </Text>
      ))}

      {/* edit button */}
      <TouchableOpacity style={styles.editButton} onPress={editRecipe}>
        <Text style={styles.editText}>Edit Recipe</Text>
      </TouchableOpacity>

      {/* delete button */}
      <TouchableOpacity style={styles.deleteButton} onPress={deleteRecipe}>
        <Text style={styles.deleteText}>Delete Recipe</Text>
      </TouchableOpacity>

      {/* back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F3FF" },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4C1D95",
    marginBottom: 15,
    textAlign: "center",
  },

  // ⭐ FIXED IMAGE SIZE FOR DESKTOP + MOBILE
  imageWrapper: {
    width: "100%",
    maxWidth: 400, // keeps desktop size normal
    alignSelf: "center",
    position: "relative",
    paddingBottom: Platform.OS === "web" ? 0 : "100%",
    height: Platform.OS === "web" ? 250 : undefined,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#eee",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  category: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B21A8",
    marginBottom: 20,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4C1D95",
    marginBottom: 8,
    marginTop: 10,
  },

  bodyText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    lineHeight: 22,
  },

  editButton: {
    backgroundColor: "#7C3AED",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },

  editText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  deleteButton: {
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
  },

  deleteText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  backButton: {
    backgroundColor: "#8B5CF6",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },

  backText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
