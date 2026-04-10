import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAddRecipeCallback } from "../utils/recipeStore";

export default function AddRecipeScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSave = () => {
    const callback = getAddRecipeCallback();

    const newRecipe = {
      title,
      category,
      ingredients,
      instructions,
      image: undefined, 
    };

    if (callback) {
      callback(newRecipe);
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Recipe</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipe Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Ingredients"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />

      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F3FF" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#2D2D2D" },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  saveButton: {
    backgroundColor: "#A78BFA",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  saveText: { color: "white", fontSize: 18, fontWeight: "600", textAlign: "center" },
});