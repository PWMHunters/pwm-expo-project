import React, { useContext, useEffect, useState } from 'react';
import { Image, FlatList, TouchableOpacity, StyleSheet, View, ScrollView, Modal, Pressable } from 'react-native';
import { Layout, Text, Button, Divider } from '@ui-kitten/components';
import { FavoritesContext, Dog } from '../context/FavoritesContext';
import api from '../api/dogApi';
import { useRouter } from 'expo-router';
import { translateTemperament, translateBreedGroup, translateGeneric, translateLifeSpan } from '../../src/utils/dogUtils';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { favoritos, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const [recomendados, setRecomendados] = useState<Dog[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await api.get('images/search', { params: { limit: 5, has_breeds: 1 } });
        setRecomendados(res.data);
      } catch (error) {
        console.log('Erro ao carregar recomendados:', error);
      }
    }
    fetchRecommended();
  }, []);

  const openDetails = (dog: Dog) => {
    setSelectedDog(dog);
    setDetailsModalVisible(true);
  };
  const closeDetails = () => setDetailsModalVisible(false);

  const renderRecomendado = ({ item }: { item: Dog }) => {
    const breed = item.breeds?.[0];
    const name = breed?.name || 'Raça desconhecida';
    const lifeSpan = translateLifeSpan(breed?.life_span);
    const temperament = translateTemperament(breed?.temperament);
    const resumoTemperamento = temperament.length > 30 ? temperament.substring(0, 30) + '...' : temperament;

    return (
      <TouchableOpacity onPress={() => openDetails(item)} style={styles.recCard}>
        <Image source={{ uri: item.url || 'https://placehold.co/300x200' }} style={styles.recImage} />
        <Text category="s1" style={styles.recTitle} numberOfLines={1}>{name}</Text>
        {breed?.temperament && <Text appearance="hint" style={styles.infoText}>🧠 {resumoTemperamento}</Text>}
        {lifeSpan && <Text appearance="hint" style={styles.infoText}>❤️ {lifeSpan}</Text>}
      </TouchableOpacity>
    );
  };

  const getDetails = (dog: Dog | null) => {
    if (!dog) return null;
    const breed = dog.breeds?.[0];
    return {
      id: dog.id,
      name: dog.name || breed?.name || 'Desconhecido',
      url: dog.url,
      height: dog.height?.metric || breed?.height?.metric,
      weight: dog.weight?.metric || breed?.weight?.metric,
      life_span: translateLifeSpan(dog.life_span || breed?.life_span),
      temperament: translateTemperament(dog.temperament || breed?.temperament),
      breed_group: translateBreedGroup(dog.breed_group || breed?.breed_group),
      bred_for: translateGeneric(dog.bred_for || breed?.bred_for),
      origin: translateGeneric(dog.origin || breed?.origin),
    };
  };

  const details = getDetails(selectedDog);
  const isSelectedFavorito = details ? favoritos.some(f => String(f.id) === String(details.id)) : false;

  return (
    <Layout style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoHeaderContainer}>
          <Image 
            source={require('../../assets/images/adotepetlogo.png')} 
            style={styles.logoHeader}
            resizeMode="contain"
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.mainCard, { backgroundColor: '#4A90E2' }]} onPress={() => router.push("/(tabs)/explorar")}>
            <Text style={styles.mainCardTitle}>🔍 Explorar</Text>
            <Text style={styles.mainCardSub}>Veja todas as raças</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.mainCard, { backgroundColor: '#E24A4A' }]} onPress={() => router.push("/(tabs)/favoritos")}>
            <Text style={styles.mainCardTitle}>❤️ Favoritos</Text>
            <Text style={styles.mainCardSub}>{favoritos.length} salvos</Text>
          </TouchableOpacity>
        </View>

        <Text category="h6" style={styles.statsTitle}>Suas Estatísticas</Text>
        <View style={styles.statsBox}>
          <Text category="s1">Favoritos: {favoritos.length}</Text>
          <Text appearance="hint">Raças registradas na app</Text>
        </View>

        <Text category="h6" style={styles.statsTitle}>Recomendados Hoje</Text>
        <FlatList
          data={recomendados}
          keyExtractor={(item) => String(item.id || Math.random())}
          renderItem={renderRecomendado}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>

      {detailsModalVisible && details && (
        <Modal visible={detailsModalVisible} animationType="fade" transparent onRequestClose={closeDetails}>
          <Pressable style={styles.modalBackdrop} onPress={closeDetails}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <ScrollView 
                showsVerticalScrollIndicator={true} 
                contentContainerStyle={{ paddingBottom: 20 }} 
                style={{maxHeight: '100%'}}
              >
                <View style={styles.modalHeader}>
                  <Text category='h5' style={{ fontWeight: 'bold', flex: 1 }}>{details.name}</Text>
                  <TouchableOpacity onPress={closeDetails}>
                    <Ionicons name="close-outline" size={28} color="#000" />
                  </TouchableOpacity>
                </View>

                {details.url && <Image source={{ uri: details.url }} style={styles.detailImage} />}

                <Text category='h6' style={styles.sectionTitle}>Características Físicas</Text>
                <Text>📏 Altura: {details.height || 'N/A'}</Text>
                <Text>⚖️ Peso: {details.weight || 'N/A'}</Text>
                <Text>❤️ Vida: {details.life_span || 'N/A'}</Text>

                <Divider style={{ marginVertical: 12 }} />

                <Text category='h6' style={styles.sectionTitle}>Sobre a Raça</Text>
                <Text>🧠 Temperamento: {details.temperament}</Text>
                {details.breed_group && <Text>🏷️ Grupo: {details.breed_group}</Text>}
                {details.bred_for && <Text>🛠️ Criado para: {details.bred_for}</Text>}
                {details.origin && <Text>🌍 Origem: {details.origin}</Text>}

                <Button
                  style={{ marginTop: 24 }}
                  status={isSelectedFavorito ? 'danger' : 'primary'}
                  onPress={() => {
                    if (isSelectedFavorito && selectedDog) removeFavorite(selectedDog.id);
                    else if(selectedDog) addFavorite(selectedDog);
                  }}
                >
                  {isSelectedFavorito ? 'Remover dos Favoritos' : 'Salvar nos Favoritos ❤️'}
                </Button>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, paddingTop: 50 },
  
  logoHeaderContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoHeader: {
    width: 150,
    height: 80,
  },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  
  mainCard: { 
    width: '48%', 
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16 
  },

  mainCardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  mainCardSub: { marginTop: 4, fontSize: 12, color: '#F0F0F0' },
  
  statsTitle: { fontWeight: 'bold', marginBottom: 10 },
  statsBox: { width: '100%', padding: 16, borderRadius: 14, backgroundColor: '#EEE', marginBottom: 22 },
  recCard: { width: 160, marginRight: 12, borderRadius: 16, padding: 0 },
  recImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 8 },
  recTitle: { marginTop: 4, marginBottom: 4, fontWeight: 'bold', fontSize: 16 },
  infoText: { fontSize: 12, marginBottom: 2, color: '#666' },

  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  modalContent: { 
    width: '100%',
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20,
    maxHeight: '85%',
    elevation: 5 
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailImage: { width: '100%', height: 250, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
  sectionTitle: { marginTop: 8, marginBottom: 8, color: '#3366FF', fontWeight: 'bold', fontSize: 16 },
});