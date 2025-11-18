import { Input, Layout, Spinner, Text } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import BreedCard from "../../../components/BreedCard";
import { getBreeds } from "../../api/dogApi";

export default function SpeciesScreen() {
  const { species } = useLocalSearchParams<{ species: string }>();
  
  const [breeds, setBreeds] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBreeds();
        const formatted = data
          .filter((b: any) => (species === "dog" ? b.id : true))
          .map((b: any) => ({
            id: b.id,
            name: b.name,
            image: b.image?.url,
          }));
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

  useEffect(() => {
    const f = breeds.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, breeds]);

  if (loading)
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner size="giant" />
        <Text appearance="hint" style={{ marginTop: 10 }}>
          Carregando raças...
        </Text>
      </Layout>
    );

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Input
        placeholder="Pesquisar raça..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 16 }}
      />
      <FlatList
        data={filtered}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "center" }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
      <Layout style={{ width: "50%", marginVertical: 6 }}>
      <BreedCard
        species={species}
        id={item.id}
        name={item.name}
        image={item.image}
      />
    </Layout>
        )}
      />
    </Layout>
  );
}
