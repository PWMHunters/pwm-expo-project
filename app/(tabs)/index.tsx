import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#4a90e2" />
    </View>
  );
}