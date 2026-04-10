import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#6B21A8" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="screenTwo"
        options={{ title: "Screen Two" }}
      />
      <Stack.Screen
        name="screenThree"
        options={{ title: "Screen Three" }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Modal Screen",
        }}
      />
    </Stack>
  );
}