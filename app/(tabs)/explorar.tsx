import React, { useEffect, useState, useContext } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Layout, Text, Card, Button, Spinner, Input, Icon, Radio, RadioGroup } from '@ui-kitten/components'; // <-- Adicionado Radio e RadioGroup
import api from '../api/dogApi';
import { FavoritesContext } from '../context/FavoritesContext';

interface Breed {
  id: number;
  name: string;
  temperament?: string;
  life_span?: string;
  image?: { url: string };
}

const SearchIcon = (props: any) => <Icon {...props} name='search-outline' />;
const FilterIcon = (props: any) => <Icon {...props} name='funnel-outline' />;

const LIFE_SPAN_OPTIONS = [
  'Qualquer',
  'Curto (< 10 anos)',
  'Médio (10 - 14 anos)',
  'Longo (> 15 anos)',
];

export default function ExplorarScreen() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoritos, addFavorite } = useContext(FavoritesContext);

  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Alterado para número simples (RadioGroup usa index numérico direto)
  const [selectedLifeSpanIndex, setSelectedLifeSpanIndex] = useState(0); 
  const [temperamentFilter, setTemperamentFilter] = useState('');

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

  const filteredBreeds = breeds.filter((breed) => {
    const matchesName = breed.name.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesTemperament = temperamentFilter 
      ? breed.temperament?.toLowerCase().includes(temperamentFilter.toLowerCase()) 
      : true;

    let matchesLifeSpan = true;
    // Usamos o índice numérico direto agora
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
            🧠 {item.temperament}
          </Text>
        )}

        {item.life_span && (
          <Text appearance="hint" category='c1' style={styles.info}>
            ❤️ Vida: {item.life_span}
          </Text>
        )}

        <Button
          style={styles.button}
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
          {isFavorito ? 'Favoritada ❤️' : 'Adicionar aos Favoritos'}
        </Button>
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
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Icon name='close-outline' fill='#000' style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            </View>

            <Text category='s2' style={styles.label}>Tempo de Vida</Text>
            
            {/* SOLUÇÃO: RadioGroup em vez de Select */}
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
              placeholder='Ex: Playful, Friendly...'
              value={temperamentFilter}
              onChangeText={setTemperamentFilter}
            />

            <Button 
              style={{ marginTop: 20 }} 
              onPress={() => setFilterModalVisible(false)}
            >
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
  noImg: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' },
  name: { fontWeight: 'bold', marginBottom: 6 },
  info: { marginBottom: 4, color: '#666' },
  button: { marginTop: 12, borderRadius: 12 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20 },
  modalCard: { width: '100%', borderRadius: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { marginBottom: 8, marginTop: 4, color: '#888', fontWeight: 'bold' }
});