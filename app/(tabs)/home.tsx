import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import api from '../api/dogApi';
import { FavoritesContext } from '../context/FavoritesContext';

interface Dog {
  id?: string;
  url?: string;
  breeds?: { name: string }[];
}

export default function HomeScreen() {
  const [cachorros, setCachorros] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const { addFavorite, favoritos } = useContext(FavoritesContext);

  useEffect(() => {
    async function fetchDogs() {
      try {
        const res = await api.get('images/search', { params: { limit: 10 } });
        setCachorros(res.data);
      } catch (error) {
        console.log('Erro ao buscar cachorros:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDogs();
  }, []);

  const renderDog = ({ item }: { item: Dog }) => {
    const isFavorito = item.id && favoritos.some((d) => d.id === item.id);

    return (
      <TouchableOpacity style={styles.card}>
        {item.url ? (
          <Image source={{ uri: item.url }} style={styles.foto} />
        ) : (
          <View style={[styles.foto, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
            <Text>Sem imagem</Text>
          </View>
        )}
        <Text style={styles.nome}>
          {item.breeds && item.breeds.length > 0 ? item.breeds[0].name : 'Desconhecido'}
        </Text>

        <TouchableOpacity
          style={[styles.btnFavorito, isFavorito && { backgroundColor: '#f00' }]}
          onPress={() => addFavorite(item)}
        >
          <Text style={styles.textoBtn}>{isFavorito ? 'Favorito ❤️' : 'Adicionar aos Favoritos'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.loading}><Text>Carregando...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Cachorros Disponíveis</Text>
      <FlatList
        data={cachorros}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderDog}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginVertical: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', padding: 8 },
  foto: { width: '100%', height: 200, borderRadius: 12 },
  nome: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  btnFavorito: { marginTop: 8, padding: 8, backgroundColor: '#0a84ff', borderRadius: 8, alignItems: 'center' },
  textoBtn: { color: '#fff', fontWeight: 'bold' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
