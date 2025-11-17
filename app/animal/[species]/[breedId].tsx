import { Card, Layout, Spinner, Text } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";

export default function BreedDetail() {
  const { species, breedId } = useLocalSearchParams();

  const [breed, setBreed] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBreed() {
      try {
        let url = "";
        if (species === "dog") url = `https://api.thedogapi.com/v1/breeds/${breedId}`;
        else if (species === "cat") url = `https://api.thecatapi.com/v1/breeds/${breedId}`;
        else return;

        const res = await fetch(url);
        const data = await res.json();
        setBreed(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBreed();
  }, [breedId, species]);

  if (loading) {
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner size="giant" />
        <Text appearance="hint" style={{ marginTop: 10 }}>
          Carregando detalhes...
        </Text>
      </Layout>
    );
  }

  if (!breed) {
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category="s1">Raça não encontrada.</Text>
      </Layout>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Card>
          {breed.image?.url && (
            <Image
              source={{ uri: breed.image.url }}
              style={{
                width: "100%",
                height: 250,
                borderRadius: 12,
                marginBottom: 16,
              }}
              resizeMode="cover"
            />
          )}
          <Text category="h5" style={{ fontWeight: "bold", marginBottom: 8 }}>
            {breed.name}
          </Text>
          {breed.origin && (
            <Text category="s2" style={{ marginBottom: 8 }}>
              🌍 Origem: {breed.origin}
            </Text>
          )}
          {breed.temperament && (
            <Text category="s2" style={{ marginBottom: 8 }}>
              🧠 Temperamento: {breed.temperament}
            </Text>
          )}
          {breed.bred_for && (
            <Text appearance="hint" style={{ marginBottom: 8 }}>
              🐾 Criado para: {breed.bred_for}
            </Text>
          )}
          {breed.description && (
            <Text appearance="hint" style={{ marginTop: 8 }}>
              {breed.description}
            </Text>
          )}
        </Card>
      </Layout>
    </ScrollView>
  );
}
