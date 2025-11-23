import React, { useContext } from 'react';
import { Image, FlatList, StyleSheet } from 'react-native';
import { Layout, Text, Card, Button } from '@ui-kitten/components';
import { FavoritesContext } from '../context/FavoritesContext';

interface Dog {
  id?: string;
  url?: string;
  breeds?: { name: string }[];
}

export default function FavoritosScreen() {
  const { favoritos, removeFavorite } = useContext(FavoritesContext);

  const renderItem = ({ item }: { item: Dog }) => {
    const imageUrl = item.url || 'https://placehold.co/300x200?text=Sem+Imagem';
    const name = item.breeds?.[0]?.name || 'Sem nome';

    return (
      <Card style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.foto} />

        <Text category="h6" style={styles.nome}>
          {name}
        </Text>

        <Button
          style={styles.btnRemover}
          status="danger"
          onPress={() => removeFavorite(item.id)}
        >
          Remover ❤️
        </Button>
      </Card>
    );
  };

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.titulo}>
        Favoritos
      </Text>

      {favoritos.length === 0 ? (
        <Text appearance="hint" style={styles.vazio}>
          Você ainda não favoritou nada 🐶✨
        </Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { marginBottom: 16, fontWeight: 'bold' },
  card: { marginBottom: 20 },
  foto: { width: '100%', height: 200, borderRadius: 12 },
  nome: { marginBottom: 6, fontWeight: 'bold' },
  btnRemover: { marginTop: 12, borderRadius: 10 },
  vazio: { marginTop: 40, fontSize: 16, textAlign: 'center' },
});