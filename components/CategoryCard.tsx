import { Card, Text } from "@ui-kitten/components";
import React from "react";
import { Image } from "react-native";

type Props = {
name: string;
image: string;
onPress: () => void;
};

export default function CategoryCard({ name, image, onPress }: Props) {
return (
    <Card
        onPress={onPress}
        style={{
        flex: 1,
        margin: 8,
        alignItems: "center",
        borderRadius: 12,
        }}
        >
        <Image
            source={{ uri: image }}
            style={{ width: 70, height: 70, marginBottom: 10 }}
        />
        <Text category="s1" style={{ textAlign: "center", fontWeight: "600" }}>
            {name}
        </Text>
    </Card>
);
}