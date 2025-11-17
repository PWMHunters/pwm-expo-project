import { Card, Text } from "@ui-kitten/components";
import React from "react";
import { Image, TouchableOpacity } from "react-native";

interface BreedCardProps {
  id: string;
  name: string;
  image?: string;
  onPress: () => void;
}

export default function BreedCard({ name, image, onPress }: BreedCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card
        style={{
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
        }}
      >
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              marginRight: 12,
            }}
          />
        )}

        <Text category="s1">{name}</Text>
      </Card>
    </TouchableOpacity>
  );
}
