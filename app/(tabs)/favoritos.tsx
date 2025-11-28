import React, { useContext, useState } from 'react';
import { Image, FlatList, StyleSheet, View, TouchableOpacity, ScrollView, Pressable, Modal } from 'react-native';
import { Layout, Text, Card, Button, Divider } from '@ui-kitten/components';
import { FavoritesContext, Dog } from '../context/FavoritesContext';
import { translateTemperament, translateBreedGroup, translateGeneric, translateLifeSpan } from '../../src/utils/dogUtils';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritosScreen() {
  const { favoritos, removeFavorite } = useContext(FavoritesContext);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const openDetails = (dog: Dog) => {
    setSelectedDog(dog);
    setDetailsModalVisible(true);
  };
  const closeDetails = () => setDetailsModalVisible(false);

  const renderItem = ({ item }: { item: Dog }) => {
    const imageUrl = item.url || 'https://placehold.co/300x200?text=Sem+Imagem';
    const name = item.name || item.breeds?.[0]?.name || 'Sem nome';

    return (
      <Card style={styles.card}>
        <TouchableOpacity onPress={() => openDetails(item)}>
          <Image source={{ uri: imageUrl }} style={styles.foto} />
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
    <View style={styles.mainWrapper}>
      <Image source={require('../../assets/images/footprints.gif')} style={styles.backgroundGif} resizeMode="cover" />
      
      <Layout style={[styles.container, { backgroundColor: 'transparent' }]}>
        <Text category="h5" style={styles.titulo}>Favoritos</Text>

        {favoritos.length === 0 ? (
          <Text appearance="hint" style={styles.vazio}>Você ainda não favoritou nada 🐶✨</Text>
        ) : (
          <FlatList
            data={favoritos}
            keyExtractor={(item, index) => String(item.id || index)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}

        {detailsModalVisible && details && (
          <Modal visible={detailsModalVisible} animationType="fade" transparent onRequestClose={closeDetails}>
            <Pressable style={styles.modalBackdrop} onPress={closeDetails}>
              <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                  <View style={styles.modalHeader}>
                    <Text category='h5' style={{fontWeight: 'bold', flex: 1}}>{details.name}</Text>
                    <TouchableOpacity onPress={closeDetails}><Ionicons name="close-outline" size={28} color="#000" /></TouchableOpacity>
                  </View>
                  {details.url && <Image source={{ uri: details.url }} style={styles.detailImage} />}
                  <Text category='h6' style={styles.sectionTitle}>Características Físicas</Text>
                  <View style={styles.detailRow}><Text category='s1'>📏 Altura:</Text><Text>{details.height ? `${details.height} cm` : 'N/A'}</Text></View>
                  <View style={styles.detailRow}><Text category='s1'>⚖️ Peso:</Text><Text>{details.weight ? `${details.weight} kg` : 'N/A'}</Text></View>
                  <View style={styles.detailRow}><Text category='s1'>❤️ Vida:</Text><Text>{details.life_span || 'N/A'}</Text></View>
                  <Divider style={{marginVertical: 12}}/>
                  <Text category='h6' style={styles.sectionTitle}>Sobre a Raça</Text>
                  <View style={styles.detailBlock}><Text category='s1'>🧠 Temperamento:</Text><Text appearance='hint'>{details.temperament}</Text></View>
                  {details.breed_group && <View style={styles.detailBlock}><Text category='s1'>🏷️ Grupo:</Text><Text appearance='hint'>{details.breed_group}</Text></View>}
                  {details.bred_for && <View style={styles.detailBlock}><Text category='s1'>🛠️ Criado para:</Text><Text appearance='hint'>{details.bred_for}</Text></View>}
                  {details.origin && <View style={styles.detailBlock}><Text category='s1'>🌍 Origem:</Text><Text appearance='hint'>{details.origin}</Text></View>}
                </ScrollView>
              </Pressable>
            </Pressable>
          </Modal>
        )}
      </Layout>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, position: 'relative', backgroundColor: '#fff' },
  backgroundGif: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.1 },
  container: { flex: 1, padding: 16, paddingTop: 50 },
  titulo: { marginBottom: 16, fontWeight: 'bold' },
  card: { marginBottom: 20, borderRadius: 16, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  foto: { width: '100%', height: 200, borderRadius: 12 },
  nome: { marginTop: 12, marginBottom: 6, fontWeight: 'bold' },
  btnRemover: { marginTop: 12, borderRadius: 10 },
  vazio: { marginTop: 40, fontSize: 16, textAlign: 'center' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#FFF', borderRadius: 16, padding: 20, maxHeight: '85%', elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailImage: { width: '100%', height: 250, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
  sectionTitle: { marginTop: 8, marginBottom: 8, color: '#3366FF', fontWeight: 'bold', fontSize: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 4 },
  detailBlock: { marginBottom: 10 }
});