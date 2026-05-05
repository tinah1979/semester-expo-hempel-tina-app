import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

//  helper to safely read params (fixes edit bugs)
const getParam = (p: any) => (Array.isArray(p) ? p[0] : p || "");

export default function ScreenTwo() {
  const router = useRouter();
  const params = useLocalSearchParams();

  //  load existing values (for editing)
  const [title, setTitle] = useState(getParam(params.title));
  const [category, setCategory] = useState(getParam(params.category));
  const [ingredients, setIngredients] = useState(getParam(params.ingredients));
  const [instructions, setInstructions] = useState(getParam(params.instructions));
  const [pickedImage, setPickedImage] = useState(getParam(params.image));
  const [imageUrl, setImageUrl] = useState("");

  //  fix index for editing
  const rawIndex = Array.isArray(params.index) ? params.index[0] : params.index;
  const index = rawIndex !== undefined ? Number(rawIndex) : null;
  const isEditing = index !== null && !isNaN(index);

  //  pick image from phone
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const resized = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 400 } }],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      //  override any URL image
      setImageUrl("");
      setPickedImage(`data:image/jpeg;base64,${resized.base64}`);
    }
  };

  //  save recipe
  const saveRecipe = async () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a recipe title.");
      return;
    }

    let finalImage = pickedImage;

    //  if user entered URL → use it instead
    if (imageUrl.trim() !== "") {
      finalImage = imageUrl.trim();
    }

    const newRecipe = {
      title,
      category,
      ingredients,
      instructions,
      image: finalImage,
    };

    try {
      const saved = await AsyncStorage.getItem("recipes_v2");
      let list = saved ? JSON.parse(saved) : [];

      //  update OR add
      if (isEditing) {
        list[index] = newRecipe;
      } else {
        list.push(newRecipe);
      }

      await AsyncStorage.setItem("recipes_v2", JSON.stringify(list));

      //  go back to home 
      router.replace("/");
    } catch (err) {
      console.log("save error:", err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        {isEditing ? "Edit Recipe" : "Add Recipe"}
      </Text>

      {/*  IMAGE PREVIEW */}
      <View style={styles.imageBox}>
        {pickedImage ? (
          <Image source={{ uri: pickedImage }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>No Image Selected</Text>
        )}
      </View>

      {/* pick from phone */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      {/*  text inputs */}
      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Category"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        placeholder="Ingredients (one per line)"
        style={styles.textArea}
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />

      <TextInput
        placeholder="Instructions (one step per line)"
        style={styles.textArea}
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      {/*  save */}
      <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
        <Text style={styles.saveText}>Save Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

//  styles 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F3FF" },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4C1D95",
    textAlign: "center",
    marginBottom: 20,
  },

  imageBox: {
    width: 300,
    height: 300,
    alignSelf: "center",
    backgroundColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  placeholder: {
    color: "#666",
    fontSize: 16,
  },

  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },

  textArea: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    minHeight: 120,
  },

  button: {
    backgroundColor: "#7C3AED",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#4C1D95",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },

  saveText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});