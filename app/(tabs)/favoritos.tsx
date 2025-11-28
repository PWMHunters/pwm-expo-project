import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, ScrollView, Pressable, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Layout, Text, Card, Button, Divider } from '@ui-kitten/components';
import { FavoritesContext, Dog } from '../context/FavoritesContext';
import { translateTemperament, translateBreedGroup, translateGeneric, translateLifeSpan } from '../../src/utils/dogUtils';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritosScreen() {
  const { favoritos, removeFavorite } = useContext(FavoritesContext);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const openDetails = (dog: Dog) => { setSelectedDog(dog); setDetailsModalVisible(true); };
  const closeDetails = () => setDetailsModalVisible(false);

  const renderItem = ({ item }: { item: Dog }) => {
    const imageUrl = item.url || 'https://placehold.co/300x200?text=Sem+Imagem';
    const name = item.name || item.breeds?.[0]?.name || 'Sem nome';
    return (
      <Card style={styles.card}>
        <TouchableOpacity onPress={() => openDetails(item)}>
          <Image source={{ uri: imageUrl }} style={styles.foto} contentFit="cover" />
        </TouchableOpacity>
        <Text category="h6" style={styles.nome}>{name}</Text>
        <Button style={styles.btnRemover} status="danger" onPress={() => removeFavorite(item.id)}>Remover ❤️</Button>
      </Card>
    );
  };

  const getDetails = (dog: Dog | null) => {
    if (!dog) return null;
    const breed = dog.breeds?.[0];
    return {
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

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.titulo}>Favoritos</Text>
      {favoritos.length === 0 ? <Text appearance="hint" style={styles.vazio}>Você ainda não favoritou nada 🐶✨</Text> : <FlatList data={favoritos} keyExtractor={(item, index) => String(item.id || index)} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 80 }} />}

      {detailsModalVisible && details && (
        <Modal visible={detailsModalVisible} animationType="fade" transparent onRequestClose={closeDetails}>
          <Pressable style={styles.modalBackdrop} onPress={closeDetails}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              
              <View style={styles.modalHeader}>
                <Text category='h5' style={{fontWeight: 'bold', flex: 1, color: '#000'}} numberOfLines={1}>
                  {details.name}
                </Text>
                <TouchableOpacity onPress={closeDetails} hitSlop={10}>
                  <Ionicons name="close-circle" size={30} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                {details.url && <Image source={{ uri: details.url }} style={styles.detailImage} contentFit="cover" />}
                
                <Text category='h6' style={styles.sectionTitle}>Características Físicas</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoItem}>📏 {details.height ? `${details.height} cm` : 'N/A'}</Text>
                  <Text style={styles.infoItem}>⚖️ {details.weight || 'N/A'} kg</Text>
                  <Text style={styles.infoItem}>❤️ {details.life_span}</Text>
                </View>

                <Divider style={{marginVertical: 10, backgroundColor: '#E4E9F2'}}/>

                <Text category='h6' style={styles.sectionTitle}>Sobre a Raça</Text>
                <View style={{ gap: 8 }}>
                  <Text style={styles.value}>
                    <Text style={styles.label}>🧠 Temperamento: </Text>
                    {details.temperament}
                  </Text>
                  
                  {details.breed_group && (
                    <Text style={styles.value}>
                      <Text style={styles.label}>🏷️ Grupo: </Text>
                      {details.breed_group}
                    </Text>
                  )}
                  
                  {details.origin && (
                    <Text style={styles.value}>
                      <Text style={styles.label}>🌍 Origem: </Text>
                      {details.origin}
                    </Text>
                  )}
                </View>

                <Button 
                  style={{ marginTop: 24 }} 
                  size='medium' 
                  status='danger' 
                  onPress={() => { removeFavorite(selectedDog!.id); closeDetails(); }}
                >
                  Remover dos Favoritos
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
  container: { flex: 1, padding: 16, paddingTop: 50 },
  titulo: { marginBottom: 16, fontWeight: 'bold' },
  card: { marginBottom: 20, borderRadius: 16, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  foto: { width: '100%', height: 200, borderRadius: 12 },
  nome: { marginTop: 12, marginBottom: 6, fontWeight: 'bold' },
  btnRemover: { marginTop: 12, borderRadius: 10 },
  vazio: { marginTop: 40, fontSize: 16, textAlign: 'center' },
  
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    padding: 20,
    alignItems: 'center'
  },
  modalContent: { 
    width: '100%', 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20, 
    maxHeight: '85%', 
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    display: 'flex', 
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8 },
  infoItem: { fontSize: 14, fontWeight: '600', color: '#555' },
  sectionTitle: { marginTop: 8, marginBottom: 8, color: '#3366FF', fontWeight: 'bold', fontSize: 16 },
  label: { fontWeight: 'bold', color: '#3366FF', fontSize: 14 },
  value: { fontSize: 14, color: '#333', lineHeight: 22 },
});