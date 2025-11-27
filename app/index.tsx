import { xParseSessionTokenKey } from "@/src/services/config";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { userService } from "../src/services/userService"; // Importe o objeto userService
import { useAuthStore } from "../src/store/authStore"; // Importe a Store

export default function Index() {
  const setCurrentUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await userService.getCurrentUser(xParseSessionTokenKey);

      if (user) {
        setCurrentUser(user);
        
        router.replace("/(tabs)/home"); 
      } else {
        router.replace("/login");
      }
    } catch (error) {
      router.replace("/login");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#4a90e2" />
    </View>
  );
}