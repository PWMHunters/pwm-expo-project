import { Card, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React from "react";
import { Image } from "react-native";

interface BreedCardProps {
id: number;
species: string;
name: string;
image?: string;
}

export default function BreedCard({id, species, name, image}: BreedCardProps) {
    const router = useRouter();
return (
    <Card
        onPress={() =>
        router.push({
        pathname: `/animal/[species]/[breedId]`,
        params: { species, breedId: id },
        })
    }
        style={{
        flex: 1,
        margin: 8,
        alignItems: "center",
        borderRadius: 12,
        }}
    >
        {image && (
        <Image
            source={{ uri: image }}
            style={{
            width: 80,
            height: 80,
            borderRadius: 10,
            marginBottom: 10,
            }}
        />
        )}

        <Text
    category="s1"
    style={{
    textAlign: "center",
    fontWeight: "600",
    flex: 1,
    flexWrap: "wrap",
    }}
>
    {name}
</Text>
    </Card>
);
}
