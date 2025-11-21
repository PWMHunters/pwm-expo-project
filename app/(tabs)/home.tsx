import React, { useContext, useEffect, useState } from 'react';
import { Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Layout, Text, Card } from '@ui-kitten/components';
import { FavoritesContext } from '../context/FavoritesContext';
import api from '../api/dogApi';
import { useRouter } from 'expo-router';

interface Dog {
  id?: string;
  url?: string;
  breeds?: { name: string }[];
}

export default function HomeScreen() {
  const router = useRouter();
  const { favoritos } = useContext(FavoritesContext);

  const [recomendados, setRecomendados] = useState<Dog[]>([]);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await api.get('images/search', { params: { limit: 3 } });
        setRecomendados(res.data);
      } catch (error) {
        console.log('Erro ao carregar recomendados:', error);
      }
    }
    fetchRecommended();
  }, []);

  const renderRecomendado = ({ item }: { item: Dog }) => {
    return (
      <Card style={styles.recCard}>
        <Image
          source={{ uri: item.url || 'https://placehold.co/300x200' }}
          style={styles.recImage}
        />
        <Text category="s1" style={styles.recTitle}>
          {item.breeds?.[0]?.name || 'Raça desconhecida'}
        </Text>
      </Card>
    );
  };

  return (
    <Layout style={styles.container}>
      
      {/* TÍTULO */}
      <Text category="h4" style={styles.titulo}>
        Olá 👋
      </Text>
      <Text category="s1" style={styles.subtitulo}>
        Pronto para descobrir novas raças hoje?
      </Text>

      {/* CARDS PRINCIPAIS */}
      <Layout style={styles.row}>

        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: '#4A90E2' }]}
          onPress={() => router.push("/(tabs)/explorar")}
        >
          <Text style={styles.mainCardTitle}>🔍 Explorar</Text>
          <Text style={styles.mainCardSub}>Veja todas as raças</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: '#E24A4A' }]}
          onPress={() => router.push("/(tabs)/favoritos")}
        >
          <Text style={styles.mainCardTitle}>❤️ Favoritos</Text>
          <Text style={styles.mainCardSub}>
            {favoritos.length} salvos
          </Text>
        </TouchableOpacity>

      </Layout>

      {/* ESTATÍSTICAS */}
      <Text category="h6" style={styles.statsTitle}>Suas Estatísticas</Text>

      <Layout style={styles.statsBox}>
        <Text category="s1">Favoritos: {favoritos.length}</Text>
        <Text appearance="hint">Raças registradas na app</Text>
      </Layout>

      {/* RECOMENDADOS */}
      <Text category="h6" style={styles.statsTitle}>Recomendados Hoje</Text>

      <FlatList
        data={recomendados}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={renderRecomendado}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  titulo: { fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { marginBottom: 22 },
  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  mainCard: {
    width: '48%',
    padding: 18,
    borderRadius: 16,
  },

  mainCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },

  mainCardSub: {
    marginTop: 6,
    fontSize: 14,
    color: '#F0F0F0',
  },

  statsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  statsBox: {
    width: '100%',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#EEE',
    marginBottom: 22,
  },

  recCard: {
    width: 180,
    marginRight: 16,
    borderRadius: 16,
  },

  recImage: {
    width: '100%',
    height: 150,
    borderRadius: 14,
  },

  recTitle: {
    marginTop: 8,
    fontWeight: '600',
  },
});
