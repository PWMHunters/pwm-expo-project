import { Card, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React from "react";
interface Membros {
  id: string;
  title: string;
  description: string;
  github: string;
  technologies: string[];
}
interface MembrostCardProps {
  membros: Membros;
}
export function ProjectCard({ membros }: MembrostCardProps) {
  const router = useRouter();

  return (
    <Card
      style={{ marginBottom: 15 }}
      onPress={() => router.push(`/membros/${membros.id}`)}
    >
      <Text category="s1">{membros.title}</Text>
      <Text appearance="hint" category="p2" style={{ marginTop: 5 }}>
        {membros.description}
      </Text>
    </Card>
  );
}