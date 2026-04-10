import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { setAddRecipeCallback } from "../utils/recipeStore";

type Recipe = {
  title: string;
  category: string;
  ingredients: string;
  instructions: string;
  image?: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // LOAD RECIPES ON APP START
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const saved = await AsyncStorage.getItem("recipes");
        if (saved) {
          setRecipes(JSON.parse(saved));
        }
      } catch (error) {
        console.log("Error loading recipes:", error);
      }
    };

    loadRecipes();
  }, []);

  // SAVE RECIPES WHENEVER THEY CHANGE
  useEffect(() => {
    const saveRecipes = async () => {
      try {
        await AsyncStorage.setItem("recipes", JSON.stringify(recipes));
      } catch (error) {
        console.log("Error saving recipes:", error);
      }
    };

    saveRecipes();
  }, [recipes]);

  // CALLBACK FOR ADD RECIPE SCREEN
  useEffect(() => {
    setAddRecipeCallback((recipe: Recipe) => {
      setRecipes((prev) => [...prev, recipe]);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>RecipeBox</Text>

      {/* YOUR RECIPES FIRST */}
      <Text style={styles.sectionTitle}>Your Recipes</Text>

      {recipes.length === 0 ? (
        <Text style={styles.emptyText}>No recipes yet — add one!</Text>
      ) : (
        recipes.map((recipe, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recipeCard}
            onPress={() =>
              router.push({
                pathname: "/screenThree",
                params: recipe,
              })
            }
          >
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.recipeCategory}>{recipe.category}</Text>
          </TouchableOpacity>
        ))
      )}

      {/* INSPIRATION OF THE DAY WITH IMAGE */}
      <Text style={styles.sectionTitle}>Inspiration of the Day</Text>

      <View style={styles.inspirationCard}>
        <Image
          source={{
            uri: "https://www.themealdb.com/images/media/meals/xrttsx1487339558.jpg",
          }}
          style={styles.inspirationImage}
        />
        <Text style={styles.inspirationTitle}>
          Spanish-style slow-cooked lamb shoulder & beans
        </Text>
      </View>

      {/* ADD RECIPE BUTTON */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/screenTwo")}
      >
        <Text style={styles.addText}>+ Add Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F3FF" },

  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#6D28D9",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#4C1D95",
  },

  emptyText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },

  recipeCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  recipeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
  },

  recipeCategory: {
    fontSize: 14,
    color: "#6B21A8",
    marginTop: 4,
  },

  inspirationCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  inspirationImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },

  inspirationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4C1D95",
  },

  addButton: {
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 10,
    marginBottom: 40,
  },

  addText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});