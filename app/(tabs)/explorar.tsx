import React, { useEffect, useState, useContext } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Text, Card, Button, Spinner, Input, Icon, Radio, RadioGroup, Divider } from '@ui-kitten/components';
import api from '../api/dogApi';
import { FavoritesContext } from '../context/FavoritesContext';

interface Breed {
  id: number;
  name: string;
  temperament?: string;
  life_span?: string;
  image?: { url: string };
  weight?: { metric: string; imperial: string };
  height?: { metric: string; imperial: string };
  breed_group?: string;
  bred_for?: string;
  origin?: string;
}

const SearchIcon = (props: any) => <Icon {...props} name='search-outline' />;
const FilterIcon = (props: any) => <Icon {...props} name='funnel-outline' />;
const InfoIcon = (props: any) => <Icon {...props} name='info-outline' />;

const LIFE_SPAN_OPTIONS = [
  'Qualquer',
  'Curto (< 10 anos)',
  'Médio (10 - 14 anos)',
  'Longo (> 15 anos)',
];

const translateTemperament = (text?: string) => {
  if (!text) return 'Desconhecido';
  const dictionary: Record<string, string> = {
    "Stubborn": "Teimoso", "Curious": "Curioso", "Playful": "Brincalhão",
    "Adventurous": "Aventureiro", "Active": "Ativo", "Fun-loving": "Divertido",
    "Friendly": "Amigável", "Intelligent": "Inteligente", "Loyal": "Leal",
    "Brave": "Corajoso", "Calm": "Calmo", "Gentle": "Gentil",
    "Confident": "Confiante", "Loving": "Amoroso", "Protective": "Protetor",
    "Trainable": "Treinável", "Independent": "Independente", "Alert": "Alerta",
    "Affectionate": "Afetuoso", "Energetic": "Energético", "Watchful": "Vigilante",
    "Hardworking": "Trabalhador", "Feisty": "Corajoso", "Docile": "Dócil",
    "Responsive": "Responsivo", "Composed": "Composto", "Receptive": "Receptivo",
    "Faithful": "Fiel"
  };
  return text.split(', ').map(word => dictionary[word] || word).join(', ');
};

const translateBreedGroup = (group?: string) => {
  if (!group) return 'Não classificado';
  const groups: Record<string, string> = {
    "Toy": "Toy (Companhia)",
    "Working": "Trabalho",
    "Hound": "Hound (Caça/Sabujo)",
    "Terrier": "Terrier",
    "Non-Sporting": "Não Esportivo",
    "Sporting": "Esportivo",
    "Herding": "Pastoreio",
    "Mixed": "Misto"
  };
  return groups[group] || group;
};

const translateGeneric = (text?: string) => {
  if (!text) return 'Desconhecido';
  
  let translated = text;

  const terms: Record<string, string> = {
    "Germany": "Alemanha", "France": "França", "UK": "Reino Unido", "United Kingdom": "Reino Unido",
    "Scotland": "Escócia", "England": "Inglaterra", "Ireland": "Irlanda", "China": "China",
    "Japan": "Japão", "Australia": "Austrália", "USA": "EUA", "United States": "Estados Unidos",
    "Canada": "Canadá", "Russia": "Rússia", "Belgium": "Bélgica", "Spain": "Espanha",
    "Italy": "Itália", "Switzerland": "Suíça", "Turkey": "Turquia", "Mexico": "México",
    "Small rodent hunting": "Caça de pequenos roedores",
    "lapdog": "cão de colo", "Lapdog": "Cão de colo",
    "hunting": "caça", "Hunting": "Caça",
    "guard dog": "cão de guarda", "Guarding": "Guarda",
    "companion": "companhia", "Companion": "Companhia",
    "herding": "pastoreio", "Herding": "Pastoreio",
    "retrieving": "buscar caça", "water dog": "cão d'água",
    "coursing": "corrida", "racing": "corrida", "fighting": "luta"
  };

  Object.keys(terms).forEach(key => {
    translated = translated.replace(new RegExp(key, 'g'), terms[key]);
  });

  return translated;
};

export default function ExplorarScreen() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoritos, addFavorite } = useContext(FavoritesContext);

  const [searchText, setSearchText] = useState('');
  
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedLifeSpanIndex, setSelectedLifeSpanIndex] = useState(0); 
  const [temperamentFilter, setTemperamentFilter] = useState('');

  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);

  useEffect(() => {
    async function fetchBreeds() {
      try {
        const res = await api.get('/breeds');
        setBreeds(res.data);
      } catch (error) {
        console.log('Erro ao buscar raças:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBreeds();
  }, []);

  const openDetails = (breed: Breed) => {
    setSelectedBreed(breed);
    setDetailsModalVisible(true);
  };

  const filteredBreeds = breeds.filter((breed) => {
    const matchesName = breed.name.toLowerCase().includes(searchText.toLowerCase());
    const translatedTemp = translateTemperament(breed.temperament).toLowerCase();
    const matchesTemperament = temperamentFilter 
      ? translatedTemp.includes(temperamentFilter.toLowerCase()) 
      : true;

    let matchesLifeSpan = true;
    if (selectedLifeSpanIndex !== 0 && breed.life_span) {
      const years = parseInt(breed.life_span.replace(/\D/g, ''), 10);
      if (selectedLifeSpanIndex === 1) matchesLifeSpan = years < 10;
      if (selectedLifeSpanIndex === 2) matchesLifeSpan = years >= 10 && years <= 14;
      if (selectedLifeSpanIndex === 3) matchesLifeSpan = years >= 15;
    }

    return matchesName && matchesTemperament && matchesLifeSpan;
  });

  const renderItem = ({ item }: { item: Breed }) => {
    const isFavorito = favoritos.some((f) => f.id === String(item.id));
    const lifeSpanTraduzido = item.life_span?.replace('years', 'anos').replace('year', 'ano');
    const temperamentoTraduzido = translateTemperament(item.temperament);

    const resumoTemperamento = temperamentoTraduzido.length > 50 
      ? temperamentoTraduzido.substring(0, 50) + '...' 
      : temperamentoTraduzido;

    return (
      <Card style={styles.card}>
        {item.image?.url ? (
          <Image source={{ uri: item.image.url }} style={styles.image} />
        ) : (
          <Layout style={[styles.image, styles.noImg]}>
            <Text appearance="hint">Sem imagem</Text>
          </Layout>
        )}

        <Text category="h6" style={styles.name}>{item.name}</Text>

        {item.temperament && (
          <Text appearance="hint" category='c1' style={styles.info}>
            🧠 {resumoTemperamento}
          </Text>
        )}

        {item.life_span && (
          <Text appearance="hint" category='c1' style={styles.info}>
            ❤️ Vida: {lifeSpanTraduzido}
          </Text>
        )}

        <View style={styles.buttonGroup}>
          <Button
            style={{flex: 1, marginRight: 8}}
            size='small'
            appearance='outline'
            accessoryLeft={InfoIcon}
            onPress={() => openDetails(item)}
          >
            Detalhes
          </Button>

          <Button
            style={{flex: 1}}
            size='small'
            status={isFavorito ? 'danger' : 'primary'}
            onPress={() =>
              addFavorite({
                id: String(item.id),
                url: item.image?.url || '',
                breeds: [{ name: item.name }],
              })
            }
          >
            {isFavorito ? 'Salvo' : 'Salvar'}
          </Button>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <Layout style={styles.loading}>
        <Spinner size="giant" />
        <Text category="s1" style={{ marginTop: 12 }}>Carregando raças...</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <View style={styles.headerContainer}>
        <Input
          style={styles.searchInput}
          placeholder='Buscar raça...'
          value={searchText}
          accessoryLeft={SearchIcon}
          onChangeText={setSearchText}
        />
        <Button 
          style={styles.filterButton} 
          appearance='outline' 
          accessoryLeft={FilterIcon}
          onPress={() => setFilterModalVisible(true)}
        />
      </View>

      <Text category="h6" style={styles.resultText}>
        {filteredBreeds.length} raças encontradas
      </Text>

      <FlatList
        data={filteredBreeds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {filterModalVisible && (
        <View style={styles.modalBackdrop}>
          <Card disabled={true} style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text category='h6'>Filtros Avançados</Text>
            </View>

            <Text category='s2' style={styles.label}>Tempo de Vida</Text>
            <RadioGroup
              selectedIndex={selectedLifeSpanIndex}
              onChange={index => setSelectedLifeSpanIndex(index)}
            >
              {LIFE_SPAN_OPTIONS.map((option, index) => (
                <Radio key={index}>{option}</Radio>
              ))}
            </RadioGroup>

            <Text category='s2' style={[styles.label, { marginTop: 16 }]}>Personalidade</Text>
            <Input
              placeholder='Ex: Brincalhão, Leal...'
              value={temperamentFilter}
              onChangeText={setTemperamentFilter}
            />

            <Button style={{ marginTop: 20 }} onPress={() => setFilterModalVisible(false)}>
              Aplicar Filtros
            </Button>
            <Button 
              style={{ marginTop: 10 }} 
              appearance='ghost'
              status='basic'
              onPress={() => {
                setTemperamentFilter('');
                setSelectedLifeSpanIndex(0);
                setFilterModalVisible(false);
              }}
            >
              Limpar Filtros
            </Button>
          </Card>
        </View>
      )}

      {detailsModalVisible && selectedBreed && (
        <View style={styles.modalBackdrop}>
          <Card disabled={true} style={[styles.modalCard, { maxHeight: '85%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text category='h5' style={{fontWeight: 'bold', flex: 1}}>{selectedBreed.name}</Text>
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                  <Icon name='close-outline' fill='#000' style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
              </View>

              {selectedBreed.image?.url && (
                <Image source={{ uri: selectedBreed.image.url }} style={styles.detailImage} />
              )}

              <Text category='h6' style={styles.sectionTitle}>Características Físicas</Text>
              <View style={styles.detailRow}>
                <Text category='s1'>📏 Altura:</Text>
                <Text>{selectedBreed.height?.metric ? `${selectedBreed.height.metric} cm` : 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text category='s1'>⚖️ Peso:</Text>
                <Text>{selectedBreed.weight?.metric ? `${selectedBreed.weight.metric} kg` : 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text category='s1'>❤️ Vida:</Text>
                <Text>{selectedBreed.life_span?.replace('years', 'anos').replace('year', 'ano') || 'N/A'}</Text>
              </View>

              <Divider style={{marginVertical: 12}}/>

              <Text category='h6' style={styles.sectionTitle}>Sobre a Raça</Text>
              <View style={styles.detailBlock}>
                <Text category='s1'>🧠 Temperamento:</Text>
                <Text appearance='hint'>{translateTemperament(selectedBreed.temperament)}</Text>
              </View>
              
              {selectedBreed.breed_group && (
                <View style={styles.detailBlock}>
                  <Text category='s1'>🏷️ Grupo:</Text>
                  <Text appearance='hint'>{translateBreedGroup(selectedBreed.breed_group)}</Text>
                </View>
              )}

              {selectedBreed.bred_for && (
                <View style={styles.detailBlock}>
                  <Text category='s1'>🛠️ Criado para:</Text>
                  <Text appearance='hint'>{translateGeneric(selectedBreed.bred_for)}</Text>
                </View>
              )}

              {selectedBreed.origin && (
                <View style={styles.detailBlock}>
                  <Text category='s1'>🌍 Origem:</Text>
                  <Text appearance='hint'>{translateGeneric(selectedBreed.origin)}</Text>
                </View>
              )}
              <View style={{marginBottom: 20}} /> 
            </ScrollView>
          </Card>
        </View>
      )}

    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  headerContainer: { flexDirection: 'row', marginBottom: 12, gap: 10 },
  searchInput: { flex: 1, borderRadius: 12 },
  filterButton: { width: 50, borderRadius: 12, paddingHorizontal: 0 },
  resultText: { marginBottom: 12, marginLeft: 4, fontSize: 14, color: '#888' },
  
  card: { marginBottom: 20, borderRadius: 16, paddingBottom: 8, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  noImg: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0', height: 200, borderRadius: 12, marginBottom: 12 },
  name: { fontWeight: 'bold', marginBottom: 6 },
  info: { marginBottom: 4, color: '#666' },
  buttonGroup: { flexDirection: 'row', marginTop: 12, gap: 8 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  modalBackdrop: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000, 
    padding: 20,
    paddingBottom: 60
  },
  modalCard: { width: '100%', borderRadius: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { marginBottom: 8, marginTop: 4, color: '#888', fontWeight: 'bold' },
  detailImage: { width: '100%', height: 250, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
  sectionTitle: { marginTop: 8, marginBottom: 8, color: '#3366FF', fontWeight: 'bold', fontSize: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 4 },
  detailBlock: { marginBottom: 10 }
});