import { Card, Input, Layout, Spinner, Text } from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";

export default function SpeciesScreen() {
  const { species } = useLocalSearchParams<{ species: string }>();
  const router = useRouter();

  const [breeds, setBreeds] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // API URLs para cada espécie
  const apiUrls: Record<string, string> = {
    dog: "https://api.thedogapi.com/v1/breeds",
    cat: "https://api.thecatapi.com/v1/breeds",
    bird: "https://api.ebird.org/v2/ref/taxonomy/ebird",
    rabbit: "https://api.api-ninjas.com/v1/animals?name=rabbit",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const url = apiUrls[species ?? "dog"];
        if (!url) return;

        const res = await fetch(url);
        const data = await res.json();

        let formatted = [];
        if (species === "dog" || species === "cat") {
          formatted = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            image: item.image?.url,
          }));
        } else {
          formatted = data.map((item: any, index: number) => ({
            id: index.toString(),
            name: item.name || item.family || "Desconhecido",
          }));
        }

        setBreeds(formatted);
        setFiltered(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [species]);

  // Filtro de busca
  useEffect(() => {
    const f = breeds.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, breeds]);

  if (loading) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Spinner size="giant" />
        <Text appearance="hint" style={{ marginTop: 10 }}>
          Carregando raças...
        </Text>
      </Layout>
    );
  }

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Text
        category="h5"
        style={{ fontWeight: "bold", textAlign: "center", marginBottom: 16 }}
      >
        Raças de{" "}
        {species === "dog"
          ? "Cachorro"
          : species === "cat"
          ? "Gato"
          : species === "bird"
          ? "Ave"
          : "Coelho"}
      </Text>

      <Input
        placeholder="Pesquisar raça..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 16 }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
                router.push({
                pathname: `/animal/[species]/[breedId]`,
                params: { species, breedId: item.id.toString() },
    })
    }
          >
            <Card
              style={{
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    marginRight: 12,
                  }}
                />
              )}
              <Text category="s1">{item.name}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Layout>
  );
}
