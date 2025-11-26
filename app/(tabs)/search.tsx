import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { FavoritesContext } from '../context/FavoritesContext';

interface Dog {
  id?: string;
  url?: string;
  breeds?: { name: string }[];
}

export default function FavoritosScreen() {
  const { favoritos, removeFavorite } = useContext(FavoritesContext);

  const renderDog = ({ item }: { item: Dog }) => (
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

      <TouchableOpacity style={styles.btnRemover} onPress={() => removeFavorite(item.id)}>
        <Text style={styles.textoBtn}>Remover ❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Favoritos</Text>
      <FlatList
        data={favoritos}
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
  btnRemover: { marginTop: 8, padding: 8, backgroundColor: '#f00', borderRadius: 8, alignItems: 'center' },
  textoBtn: { color: '#fff', fontWeight: 'bold' },
});