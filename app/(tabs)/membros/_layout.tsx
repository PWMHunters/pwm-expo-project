import { Stack } from "expo-router";

export default function MembersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Meus Projetos", headerShown: false }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Meus projetos", headerShown: true }}
      />
    </Stack>
  );
}