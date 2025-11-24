import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

interface Abrigo {
  id: string;
  nome: string;
  endereco: string;
}

export default function AbrigoScreen() {
  const abrigos: Abrigo[] = [
    { id: '1', nome: 'Abrigo São Francisco', endereco: 'Rua das Flores, 123' },
    { id: '2', nome: 'Lar dos Animais', endereco: 'Av. Brasil, 456' },
    { id: '3', nome: 'Casa do Bicho', endereco: 'Praça Central, 78' },
  ];

  const renderAbrigo = ({ item }: { item: Abrigo }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text>{item.endereco}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Abrigos</Text>
      <FlatList
        data={abrigos}
        keyExtractor={(item) => item.id}
        renderItem={renderAbrigo}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginVertical: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, padding: 12 },
  nome: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
});
