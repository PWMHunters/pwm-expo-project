import { Button, Layout, Text } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import { Linking } from "react-native";
import { members } from "../../data/membros";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const member = members.find((m) => m.id === id);

  if (!member) {
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Projeto não encontrado 😢</Text>
      </Layout>
    );
  }

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Text category="h5">{member.title}</Text>
      <Text appearance="hint" style={{ marginTop: 10 }}>{member.description}</Text>
      <Text category="s1" style={{ marginBottom: 5, marginTop: 20 }}>
          Tecnologias:
        </Text>
        {member.technologies.map((tech, index) => (
          <Text key={index}>• {tech}</Text>
        ))}

        <Button
          style={{ marginTop: 60 }}
          onPress={() => Linking.openURL(member.github)}
        >
          Ver no GitHub
        </Button>
    </Layout>
  );
}