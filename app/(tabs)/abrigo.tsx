// app/(tabs)/abrigo.tsx
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ABRIGOS_DATA = [
  {
    id: '1',
    nome: 'Abrigo Esperança Animal',
    endereco: 'Rua das Flores, 123',
    imagem: 'https://placedog.net/600/400?r=1',
  },
  {
    id: '2',
    nome: 'Lar dos Peludos',
    endereco: 'Av. Brasil, 456',
    imagem: 'https://placedog.net/600/400?r=2',
  },
  {
    id: '3',
    nome: 'Casa do Bicho Feliz',
    endereco: 'Praça Central, 78',
    imagem: 'https://placedog.net/600/400?r=3',
  },
];

export default function AbrigoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Abrigos</Text>

      <FlatList
        data={ABRIGOS_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/abrigo/${item.id}`)}
          >
            <Image source={{ uri: item.imagem }} style={styles.imagem} />

            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.endereco}>{item.endereco}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    gap: 12,
    elevation: 3,
  },
  imagem: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#ddd' },
  nome: { fontSize: 18, fontWeight: 'bold' },
  endereco: { color: '#555' },
});
