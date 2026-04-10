import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { setAddRecipeCallback } from "../../utils/recipeStore";

// MealDB type
type Meal = {
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strInstructions: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const [recipes, setRecipes] = useState<any[]>([]);
  const [inspiration, setInspiration] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Register callback so Add Recipe can update this list
  const addRecipe = (recipe: any) => {
    setRecipes((prev) => [...prev, recipe]);
  };

  useEffect(() => {
    setAddRecipeCallback(addRecipe);
  }, []);

  // Fetch random recipe
  useEffect(() => {
    const loadInspiration = async () => {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const json = await res.json();
        setInspiration(json.meals[0]);
      } catch {
        setError("Could not load recipe inspiration");
      } finally {
        setLoading(false);
      }
    };
    loadInspiration();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "RecipeBox" }} />

      <Text style={styles.header}>RecipeBox</Text>

      {/* Inspiration */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Inspiration of the Day</Text>

        {loading && <Text>Loading...</Text>}
        {error !== "" && <Text style={styles.error}>{error}</Text>}

        {inspiration && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screenThree",
                params: {
                  title: inspiration.strMeal,
                  ingredients: inspiration.strInstructions,
                  category: inspiration.strCategory,
                  image: inspiration.strMealThumb,
                },
              })
            }
          >
            <Image
              source={{ uri: inspiration.strMealThumb }}
              style={styles.inspirationImage}
            />
            <Text style={styles.inspirationTitle}>{inspiration.strMeal}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Your Recipes */}
      <Text style={styles.sectionTitle}>Your Recipes</Text>

      {recipes.length === 0 ? (
        <Text style={styles.emptyText}>No recipes yet. Add one!</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() =>
                router.push({
                  pathname: "/screenThree",
                  params: item,
                })
              }
            >
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeCategory}>{item.category}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Link href="/screenTwo" style={styles.addButton}>
        + Add Recipe
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F3FF" },
  header: { fontSize: 32, fontWeight: "bold", marginBottom: 20, color: "#2D2D2D" },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 10, color: "rgb(107, 33, 168)" },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inspirationImage: { width: "100%", height: 180, borderRadius: 10, marginBottom: 10 },
  inspirationTitle: { fontSize: 18, fontWeight: "600", color: "#2D2D2D" },
  emptyText: { color: "#6B7280", marginBottom: 20 },
  recipeCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: "#A78BFA",
  },
  recipeTitle: { fontSize: 18, fontWeight: "600", color: "#2D2D2D" },
  recipeCategory: { fontSize: 14, color: "#6B7280" },
  addButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#A78BFA",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
    fontSize: 18,
    fontWeight: "600",
  },
  error: { color: "red" },
});