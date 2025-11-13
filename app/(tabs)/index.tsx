import { Layout, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import CategoryCard from "../../components/CategoryCard";
import { especiesData } from "../../data/especies";

export default function Home() {
const router = useRouter();

return (
    <Layout style={{ flex: 1, padding: 16 }}>
    <Text
        category="h5"
        style={{
        marginBottom: 16,
        fontWeight: "bold",
        textAlign: "center",
        }}
    >
        Categorias
    </Text>

    <FlatList
        data={especiesData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
        <CategoryCard
            name={item.name}
            image={item.image}
            onPress={() => router.push(`./animal/${item.species}`)}
        />
        )}
    />
    </Layout>
);
}