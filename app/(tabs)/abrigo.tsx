import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Abrigo {
  id: string;
  nome: string;
  endereco: string;
  descricao: string;
  fotosPets: string[]; 
}

const BASE_ABRIGOS = [
  {
    id: '1',
    nome: 'Abrigo São Francisco',
    endereco: 'Rua das Palmeiras, 122 – Jardim Horizonte',
    descricao: 'Resgate e cuidado de cães abandonados, focando em adoções responsáveis.',
  },
  {
    id: '2',
    nome: 'Lar dos Animais',
    endereco: 'Av. Brasil, 456 – Jardim América',
    descricao: 'Acolhimento de animais perdidos e adoção consciente.',
  },
  {
    id: '3',
    nome: 'Casa do Bicho',
    endereco: 'Praça Central, 78 – Vila Nova',
    descricao: 'Cuidados especiais para cães idosos e preparação para adoção.',
  },
];

const PLACEHOLDER = 'https://placehold.co/400x300?text=Sem+Imagem';

export default function AbrigoScreen() {
  const router = useRouter();
  const [abrigos, setAbrigos] = useState<Abrigo[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets(); 

  const fetchUniqueDogs = async (count: number): Promise<string[]> => {
    try {
      const res = await fetch(`https://dog.ceo/api/breeds/image/random/${count}`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.message)) {
        return data.message;
      }
      return Array(count).fill(PLACEHOLDER);
    } catch {
      return Array(count).fill(PLACEHOLDER);
    }
  };

  useEffect(() => {
    const carregar = async () => {
      const lista: Abrigo[] = [];
      for (const abrigo of BASE_ABRIGOS) {
        const fotos = await fetchUniqueDogs(3);
        lista.push({ ...abrigo, fotosPets: fotos });
      }
      setAbrigos(lista);
      setLoading(false);
    };
    carregar();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{marginTop: 10}}>Carregando abrigos...</Text>
      </View>
    );
  }

  const renderAbrigo = ({ item }: { item: Abrigo }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.endereco}>📍 {item.endereco}</Text>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <View style={styles.fotosContainer}>
        {item.fotosPets.slice(0, 2).map((fotoUrl, index) => (
          <Image key={`${item.id}-${index}`} source={{ uri: fotoUrl }} style={styles.petFoto} resizeMode="cover" />
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => router.push({ pathname: '/abrigo/[id]', params: { id: item.id, nome: item.nome, descricao: item.descricao, endereco: item.endereco, fotos: JSON.stringify(item.fotosPets), cnpj: '12.345.678/0001-99', telefone: '(31) 99999-8888', email: 'contato@abrigo.com', horario: 'Seg a Sex, 08h às 18h', }, })}>
        <Text style={styles.btnTexto}>Conhecer abrigo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainWrapper}>
      <Image source={require('../../assets/images/footprints.gif')} style={styles.backgroundGif} resizeMode="cover" />
      
      <View style={[
        styles.container, 
        { paddingTop: insets.top > 0 ? insets.top + 10 : 40 } 
      ]}>
        <Text style={styles.titulo}>🐶 Abrigos Parceiros</Text>
        <FlatList
          data={abrigos}
          keyExtractor={(item) => item.id}
          renderItem={renderAbrigo}
          contentContainerStyle={{ paddingBottom: 100 }} 
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, position: 'relative', backgroundColor: '#fff' },
  backgroundGif: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.1 },
  container: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  nome: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: '#000' },
  endereco: { fontSize: 14, color: '#666', marginBottom: 8 },
  descricao: { fontSize: 14, color: '#555', marginBottom: 16, lineHeight: 20 },
  fotosContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  petFoto: { width: '48%', height: 120, borderRadius: 12, backgroundColor: '#F0F0F0' },
  btn: { backgroundColor: '#4A90E2', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});