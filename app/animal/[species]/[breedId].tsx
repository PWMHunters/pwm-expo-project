import { Layout, Spinner, Text } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";
import { getBreedById } from "../../api/dogApi";

export default function BreedDetail() {
  const { breedId } = useLocalSearchParams<{ breedId: string }>();
  const [breed, setBreed] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBreed() {
      try {
        const data = await getBreedById(breedId);
        setBreed(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBreed();
  }, [breedId]);

  if (loading)
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner size="giant" />
        <Text appearance="hint" style={{ marginTop: 10 }}>
          Carregando detalhes...
        </Text>
      </Layout>
    );

  if (!breed)
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category="s1">Raça não encontrada.</Text>
      </Layout>
    );

  return (
    <ScrollView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 16 }}>
          {breed.image?.url && (
            <Image
              source={{ uri: breed.image.url }}
              style={{ width: "100%", height: 250, borderRadius: 12, marginBottom: 16 }}
              resizeMode="cover"
            />
          )}
          <Text category="h5" style={{ fontWeight: "bold", marginBottom: 8 }}>
            {breed.name}
          </Text>
          {breed.origin && <Text>🌍 Origem: {breed.origin}</Text>}
          {breed.temperament && <Text>🧠 Temperamento: {breed.temperament}</Text>}
          {breed.bred_for && <Text>🐾 Criado para: {breed.bred_for}</Text>}
          {breed.description && <Text>{breed.description}</Text>}
      </Layout>
    </ScrollView>
  );
}
