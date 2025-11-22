import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getCurrentUser } from "../src/services/userService";

export default function Index() {
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Verifica no Back4App/Storage se tem usuário válido
      const user = await getCurrentUser();

      if (user) {
        // Se tiver usuário, manda para as abas (Home)
        router.replace("/(tabs)");
      } else {
        // Se não, manda para o Login
        router.replace("/login");
      }
    } catch (error) {
      // Por segurança, se der erro, manda pro login
      router.replace("/login");
    }
  };

  // Mostra um loading enquanto decide
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#4a90e2" />
    </View>
  );
}