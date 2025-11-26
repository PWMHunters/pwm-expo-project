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

  // FAZ O FETCH DE FOTOS ALEATÓRIAS
  const fetchRandomDog = async () => {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await res.json();
      return data.message; // URL da foto
    } catch {
      return PLACEHOLDER;
    }
  };

  useEffect(() => {
    const carregar = async () => {
      const lista: Abrigo[] = [];

      for (const abrigo of BASE_ABRIGOS) {
        const fotos: string[] = [];

        // pegar 3 fotos aleatórias da API
        for (let i = 0; i < 3; i++) {
          const foto = await fetchRandomDog();
          fotos.push(foto);
        }

        lista.push({
          ...abrigo,
          fotosPets: fotos,
        });
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
        <Text>Carregando fotos...</Text>
      </View>
    );
  }

  const renderAbrigo = ({ item }: { item: Abrigo }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.endereco}>📍 {item.endereco}</Text>
      <Text style={styles.descricao}>{item.descricao}</Text>

      <View style={styles.fotosRow}>
        {item.fotosPets.slice(0, 2).map((fotoUrl, index) => (
          <Image
            key={index}
            source={{ uri: fotoUrl }}
            style={styles.petFoto}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          router.push({
            pathname: '/abrigo/[id]',
            params: {
              id: item.id,
              nome: item.nome,
              descricao: item.descricao,
              endereco: item.endereco,
              fotos: JSON.stringify(item.fotosPets),
              cnpj: '12.345.678/0001-99',
              telefone: '(31) 99999-8888',
              email: 'contato@abrigo.com',
              horario: 'Seg a Sex, 08h às 18h',
            },
          })
        }
      >
        <Text style={styles.btnTexto}>Conhecer abrigo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🐶 Abrigos Parceiros</Text>

      <FlatList
        data={abrigos}
        keyExtractor={(item) => item.id}
        renderItem={renderAbrigo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    elevation: 3,
  },

  nome: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  endereco: { fontSize: 14, color: '#444', marginBottom: 8 },
  descricao: { fontSize: 14, color: '#555', marginBottom: 10 },

  fotosRow: { flexDirection: 'row', marginBottom: 14 },

  petFoto: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#DDD',
    marginRight: 10,
  },

  btn: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  btnTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
