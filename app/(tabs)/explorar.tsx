import React, { useEffect, useState, useContext } from 'react';
import { FlatList, Image, StyleSheet } from 'react-native';
import { Layout, Text, Card, Button, Spinner } from '@ui-kitten/components';
import api from '../api/dogApi';
import { FavoritesContext } from '../context/FavoritesContext';

interface Breed {
  id: number;
  name: string;
  temperament?: string;
  life_span?: string;
  image?: { url: string };
}

export default function ExplorarScreen() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoritos, addFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    async function fetchBreeds() {
      try {
        const res = await api.get('/breeds');
        setBreeds(res.data);
      } catch (error) {
        console.log('Erro ao buscar raças:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBreeds();
  }, []);

  if (loading) {
    return (
      <Layout style={styles.loading}>
        <Spinner size="giant" />
        <Text category="s1" style={{ marginTop: 12 }}>
          Carregando raças...
        </Text>
      </Layout>
    );
  }

  const renderItem = ({ item }: { item: Breed }) => {
    const isFavorito = favoritos.some((f) => f.id === String(item.id));

    return (
      <Card style={styles.card}>
        {item.image?.url ? (
          <Image source={{ uri: item.image.url }} style={styles.image} />
        ) : (
          <Layout style={[styles.image, styles.noImg]}>
            <Text appearance="hint">Sem imagem</Text>
          </Layout>
        )}

        <Text category="h6" style={styles.name}>
          {item.name}
        </Text>

        {item.temperament && (
          <Text appearance="hint" style={styles.info}>
            🧠 {item.temperament}
          </Text>
        )}

        {item.life_span && (
          <Text appearance="hint" style={styles.info}>
            ❤️ Vida: {item.life_span}
          </Text>
        )}

        <Button
          style={styles.button}
          status={isFavorito ? 'danger' : 'primary'}
          onPress={() =>
            addFavorite({
              id: String(item.id),
              url: item.image?.url || '',
              breeds: [{ name: item.name }],
            })
          }
        >
          {isFavorito ? 'Favoritada ❤️' : 'Adicionar aos Favoritos'}
        </Button>
      </Card>
    );
  };

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.title}>
        Explorar Raças 🐾
      </Text>

      <FlatList
        data={breeds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 16, fontWeight: 'bold' },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    paddingBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  noImg: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  info: { marginBottom: 4 },
  button: {
    marginTop: 12,
    borderRadius: 12,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
