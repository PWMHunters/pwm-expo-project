import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../api/dogApi'; 

type ParamsType = {
  id?: string;
  nome?: string;
  descricao?: string;
  endereco?: string;
};

export default function AbrigoDetalhe() {
  const router = useRouter();
  const params = useLocalSearchParams() as ParamsType;

  const [fotos, setFotos] = useState<string[]>([]);

  async function carregarFotosRandom() {
    try {
      const res = await api.get('/images/search?limit=6');
      const urls = res.data.map((d: any) => d.url).filter(Boolean);
      setFotos(urls);
    } catch (error) {
      console.log("Erro ao carregar fotos:", error);
      setFotos([]);
    }
  }

  useEffect(() => {
    carregarFotosRandom();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* BOTÃO VOLTAR */}
        <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </TouchableOpacity>

        {/* DADOS DO ABRIGO */}
        <Text style={styles.titulo}>{params.nome ?? 'Abrigo'}</Text>
        {params.endereco ? <Text style={styles.endereco}>📍 {params.endereco}</Text> : null}
        {params.descricao ? <Text style={styles.descricao}>{params.descricao}</Text> : null}

        {/* PETS */}
        <Text style={styles.subtitulo}>Pets do Abrigo</Text>

        {fotos.length === 0 ? (
          <View style={styles.noFotos}>
            <Text style={{ color: '#666' }}>Carregando fotos...</Text>
          </View>
        ) : (
          <FlatList
            data={fotos}
            keyExtractor={(_, i) => String(i)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <View style={styles.petCard}>
                <Image
                  source={{ uri: item }}
                  style={styles.petImg}
                />
              </View>
            )}
          />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  voltar: { marginBottom: 8 },
  voltarTexto: { fontSize: 16, color: '#2563EB' },

  titulo: { fontSize: 26, fontWeight: '700', marginTop: 2, marginBottom: 6 },
  endereco: { color: '#555', marginBottom: 8 },
  descricao: { color: '#444', marginBottom: 12, lineHeight: 20 },

  subtitulo: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 8 },

  noFotos: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 14,
  },

  petCard: {
    width: 160,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },

  petImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#ddd',
  },
});
