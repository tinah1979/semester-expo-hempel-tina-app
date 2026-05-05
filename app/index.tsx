import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// user recipe type
type Recipe = {
  title: string;
  category: string;
  ingredients: string;
  instructions: string;
  image?: string;
};

// inspiration meal type
type Meal = {
  strMeal: string;
  strMealThumb: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [inspiration, setInspiration] = useState<Meal | null>(null);

  // load recipes from storage
  const loadRecipes = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem("recipes_v2");
      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setRecipes(parsed);
        } else {
          setRecipes([]);
        }
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.log("error loading recipes:", error);
      setRecipes([]);
    }
  }, []);

  // load once on mount
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  // reload every time Home gets focus
  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes])
  );

  // load random inspiration meal
  useEffect(() => {
    const loadInspiration = async () => {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const data = await res.json();
        setInspiration(data.meals[0]);
      } catch (err) {
        console.log("error loading inspiration:", err);
      }
    };

    loadInspiration();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* app title */}
      <Text style={styles.header}>RecipeBox</Text>

      {/* user recipes section */}
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
                params: { ...recipe, index },
              })
            }
          >
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.recipeCategory}>{recipe.category}</Text>
          </TouchableOpacity>
        ))
      )}

      {/* inspiration section */}
      <Text style={styles.sectionTitle}>Inspiration of the Day</Text>

      {inspiration && (
        <View style={styles.inspirationCard}>
          <View style={styles.inspirationImageWrapper}>
            <Image
              source={{ uri: inspiration.strMealThumb }}
              style={styles.inspirationImage}
            />
          </View>

          <Text style={styles.inspirationTitle}>{inspiration.strMeal}</Text>
        </View>
      )}

      {/* add recipe button */}
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
    alignItems: "center",
  },

  inspirationImageWrapper: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    position: "relative",
    paddingBottom: Platform.OS === "web" ? 0 : "100%",
    height: Platform.OS === "web" ? 250 : undefined,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },

  inspirationImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  inspirationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4C1D95",
    textAlign: "center",
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
