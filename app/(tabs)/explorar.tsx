import React, { useEffect, useState, useContext, useMemo } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, ScrollView, Pressable, Keyboard, Modal, Platform, KeyboardAvoidingView } from 'react-native';
import { Image } from 'expo-image';
import { Layout, Text, Card, Button, Spinner, Input, Divider } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/dogApi';
import { FavoritesContext, Dog } from '../context/FavoritesContext';
import { translateTemperament, translateBreedGroup, translateGeneric, translateLifeSpan } from '../../src/utils/dogUtils';

const getIconColor = (props: any) => props?.style?.tintColor || '#8F9BB3';
const SearchIcon = (props: any) => <Ionicons name="search-outline" size={24} color={getIconColor(props)} />;
const InfoIcon = (props: any) => <Ionicons name="information-circle-outline" size={24} color={getIconColor(props)} />;

const parseRange = (text?: string) => {
  if (!text) return { min: 0, max: 999 };
  const clean = text.replace(/[^0-9.-]/g, '');
  const parts = clean.split('-');
  let min = parseFloat(parts[0]);
  let max = parts.length > 1 ? parseFloat(parts[1]) : min;
  return { min: isNaN(min) ? 0 : min, max: isNaN(max) ? 999 : max };
};

const MultiSelectAccordion = ({ title, options, selectedValues, onToggle }: any) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text category='s2' style={{ color: '#333', fontWeight: 'bold' }}>
          {title} {selectedValues.length > 0 ? `(${selectedValues.length})` : ''}
        </Text>
        <Ionicons 
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} 
          size={20} 
          color="#333" 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.accordionContent}>
          <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
            {options.map((opt: string) => {
              const isSelected = selectedValues.includes(opt);
              return (
                <TouchableOpacity 
                  key={opt} 
                  style={styles.checkboxItemCustom} 
                  onPress={() => onToggle(opt)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={isSelected ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={isSelected ? "#3366FF" : "#8F9BB3"} 
                  />
                  <Text style={[styles.checkboxLabel, { color: isSelected ? '#3366FF' : '#333' }]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {options.length === 0 && (
              <Text style={{color: '#999', fontStyle: 'italic', padding: 8}}>
                Nenhuma opção disponível
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default function ExplorarScreen() {
  const [breeds, setBreeds] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoritos, addFavorite } = useContext(FavoritesContext);
  
  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  const [minLife, setMinLife] = useState('');
  const [maxLife, setMaxLife] = useState('');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedBredFor, setSelectedBredFor] = useState<string[]>([]);

  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<Dog | null>(null);

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

  const options = useMemo(() => {
    const groups = new Set<string>();
    const temperaments = new Set<string>();
    const origins = new Set<string>();
    const bredFors = new Set<string>();
    
    if (breeds.length > 0) {
      breeds.forEach(b => {
        if (b.breed_group) groups.add(translateBreedGroup(b.breed_group));
        if (b.temperament) { 
          const translatedTemp = translateTemperament(b.temperament); 
          translatedTemp.split(', ').forEach(t => temperaments.add(t.trim())); 
        }
        if (b.origin) { 
          const translatedOrigin = translateGeneric(b.origin); 
          translatedOrigin.split(', ').forEach(o => { 
            if(o && o !== 'Desconhecido') origins.add(o.trim()); 
          }); 
        }
        if (b.bred_for) { 
          const translatedBred = translateGeneric(b.bred_for); 
          bredFors.add(translatedBred); 
        }
      });
    }
    return { 
      groups: Array.from(groups).sort(), 
      temperaments: Array.from(temperaments).sort(), 
      origins: Array.from(origins).sort(), 
      bredFors: Array.from(bredFors).sort() 
    };
  }, [breeds]);

  const openDetails = (breed: Dog) => { setSelectedBreed(breed); setDetailsModalVisible(true); };
  const closeFilters = () => { Keyboard.dismiss(); setFilterModalVisible(false); };
  const closeDetails = () => setDetailsModalVisible(false);
  
  const toggleSelection = (list: string[], setList: Function, value: string) => { 
    if (list.includes(value)) setList(list.filter(item => item !== value)); 
    else setList([...list, value]); 
  };

  const filteredBreeds = useMemo(() => {
     return breeds.filter((breed) => {
      const matchesName = breed.name?.toLowerCase().includes(searchText.toLowerCase());
      
      const lifeRange = parseRange(breed.life_span);
      const userMinLife = minLife ? parseFloat(minLife) : 0;
      const userMaxLife = maxLife ? parseFloat(maxLife) : 999;
      const matchesLife = lifeRange.min >= userMinLife && lifeRange.max <= userMaxLife;

      const weightRange = parseRange(breed.weight?.metric);
      const userMinWeight = minWeight ? parseFloat(minWeight) : 0;
      const userMaxWeight = maxWeight ? parseFloat(maxWeight) : 999;
      const matchesWeight = weightRange.min >= userMinWeight && weightRange.max <= userMaxWeight;

      const heightRange = parseRange(breed.height?.metric);
      const userMinHeight = minHeight ? parseFloat(minHeight) : 0;
      const userMaxHeight = maxHeight ? parseFloat(maxHeight) : 999;
      const matchesHeight = heightRange.min >= userMinHeight && heightRange.max <= userMaxHeight;

      const translatedGroup = translateBreedGroup(breed.breed_group);
      const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(translatedGroup);

      const translatedTemp = translateTemperament(breed.temperament);
      const matchesTemperament = selectedTemperaments.length === 0 || selectedTemperaments.some(t => translatedTemp.includes(t));

      const translatedOrigin = translateGeneric(breed.origin);
      const matchesOrigin = selectedOrigins.length === 0 || selectedOrigins.some(o => translatedOrigin.includes(o));

      const translatedBred = translateGeneric(breed.bred_for);
      const matchesBredFor = selectedBredFor.length === 0 || selectedBredFor.some(b => translatedBred.includes(b));

      return matchesName && matchesLife && matchesWeight && matchesHeight && matchesGroup && matchesTemperament && matchesOrigin && matchesBredFor;
    });
  }, [breeds, searchText, minLife, maxLife, minWeight, maxWeight, minHeight, maxHeight, selectedGroups, selectedTemperaments, selectedOrigins, selectedBredFor]);

  const renderItem = ({ item }: { item: Dog }) => {
    const isFavorito = favoritos.some((f) => String(f.id) === String(item.id));
    const lifeSpanTraduzido = translateLifeSpan(item.life_span);
    const temperamentoTraduzido = translateTemperament(item.temperament);
    const resumoTemperamento = temperamentoTraduzido.length > 50 ? temperamentoTraduzido.substring(0, 50) + '...' : temperamentoTraduzido;
    
    return (
      <Card style={styles.card}>
        <TouchableOpacity onPress={() => openDetails(item)}>
          {item.image?.url ? <Image source={{ uri: item.image.url }} style={styles.image} contentFit="cover" /> : <Layout style={[styles.image, styles.noImg]}><Text appearance="hint">Sem imagem</Text></Layout>}
        </TouchableOpacity>
        <Text category="h6" style={styles.name}>{item.name}</Text>
        {item.temperament && <Text appearance="hint" category='c1' style={styles.info}>🧠 {resumoTemperamento}</Text>}
        {item.life_span && <Text appearance="hint" category='c1' style={styles.info}>❤️ Vida: {lifeSpanTraduzido}</Text>}
        <View style={styles.buttonGroup}>
          <Button style={{flex: 1, marginRight: 8}} size='small' appearance='outline' accessoryLeft={InfoIcon} onPress={() => openDetails(item)}>Detalhes</Button>
          <Button 
            style={{flex: 1}} 
            size='small' 
            status={isFavorito ? 'danger' : 'primary'} 
            onPress={() => addFavorite({id: item.id, url: item.image?.url || '', name: item.name, breeds: [{ name: item.name || '', temperament: item.temperament, life_span: item.life_span, breed_group: item.breed_group, bred_for: item.bred_for, origin: item.origin, weight: item.weight, height: item.height }]})}
          >
            {isFavorito ? 'Salvo' : 'Salvar'}
          </Button>
        </View>
      </Card>
    );
  };

  if (loading) return <Layout style={styles.loading}><Spinner size="giant" /><Text category="s1" style={{ marginTop: 12 }}>Carregando raças...</Text></Layout>;

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
        <TouchableOpacity style={styles.filterButtonCustom} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="funnel" size={24} color="#3366FF" />
        </TouchableOpacity>
      </View>

      <Text category="h6" style={styles.resultText}>{filteredBreeds.length} raças encontradas</Text>
      
      <FlatList 
        data={filteredBreeds} 
        keyExtractor={(item) => String(item.id)} 
        renderItem={renderItem} 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false} 
        initialNumToRender={10}
      />

      <Modal 
        visible={filterModalVisible} 
        animationType="slide" 
        transparent={true} 
        onRequestClose={closeFilters}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeFilters}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              
              <View style={styles.modalHeader}>
                <Text category='h5' style={{ fontWeight: 'bold', color: '#000' }}>Filtros Avançados</Text>
                <TouchableOpacity onPress={closeFilters} hitSlop={20}>
                  <Ionicons name="close-circle" size={30} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <View style={styles.filterRow}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text category='s2' style={styles.label}>Vida (anos)</Text>
                    <View style={styles.inputRow}>
                      <Input style={styles.miniInput} placeholder='Min' keyboardType='numeric' value={minLife} onChangeText={setMinLife} size='small' />
                      <Text style={styles.dash}>-</Text>
                      <Input style={styles.miniInput} placeholder='Max' keyboardType='numeric' value={maxLife} onChangeText={setMaxLife} size='small' />
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text category='s2' style={styles.label}>Peso (kg)</Text>
                    <View style={styles.inputRow}>
                      <Input style={styles.miniInput} placeholder='Min' keyboardType='numeric' value={minWeight} onChangeText={setMinWeight} size='small' />
                      <Text style={styles.dash}>-</Text>
                      <Input style={styles.miniInput} placeholder='Max' keyboardType='numeric' value={maxWeight} onChangeText={setMaxWeight} size='small' />
                    </View>
                  </View>
                </View>

                <View style={[styles.filterRow, { marginTop: 12 }]}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text category='s2' style={styles.label}>Altura (cm)</Text>
                    <View style={styles.inputRow}>
                      <Input style={styles.miniInput} placeholder='Min' keyboardType='numeric' value={minHeight} onChangeText={setMinHeight} size='small' />
                      <Text style={styles.dash}>-</Text>
                      <Input style={styles.miniInput} placeholder='Max' keyboardType='numeric' value={maxHeight} onChangeText={setMaxHeight} size='small' />
                    </View>
                  </View>
                </View>

                <Divider style={{ marginVertical: 16, backgroundColor: '#DDD' }}/>

                <MultiSelectAccordion title="Grupos de Raça" options={options.groups} selectedValues={selectedGroups} onToggle={(val: string) => toggleSelection(selectedGroups, setSelectedGroups, val)} />
                <MultiSelectAccordion title="Temperamento" options={options.temperaments} selectedValues={selectedTemperaments} onToggle={(val: string) => toggleSelection(selectedTemperaments, setSelectedTemperaments, val)} />
                <MultiSelectAccordion title="Origem" options={options.origins} selectedValues={selectedOrigins} onToggle={(val: string) => toggleSelection(selectedOrigins, setSelectedOrigins, val)} />
                <MultiSelectAccordion title="Criado Para" options={options.bredFors} selectedValues={selectedBredFor} onToggle={(val: string) => toggleSelection(selectedBredFor, setSelectedBredFor, val)} />
                
              </ScrollView>

              <View style={styles.modalFooter}>
                <Button style={{ marginBottom: 10 }} onPress={closeFilters}>
                  Ver Resultados ({filteredBreeds.length})
                </Button>
                <Button 
                  appearance='ghost' 
                  status='basic' 
                  onPress={() => { 
                    setSelectedGroups([]); setSelectedTemperaments([]); setSelectedOrigins([]); setSelectedBredFor([]); 
                    setMinLife(''); setMaxLife(''); setMinWeight(''); setMaxWeight(''); setMinHeight(''); setMaxHeight(''); 
                  }}
                >
                  Limpar Filtros
                </Button>
              </View>

            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {detailsModalVisible && selectedBreed && (
        <Modal visible={detailsModalVisible} animationType="fade" transparent onRequestClose={closeDetails}>
          <Pressable style={styles.modalBackdrop} onPress={closeDetails}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              
              <View style={styles.modalHeader}>
                <Text category='h5' style={{fontWeight: 'bold', flex: 1, color: '#000'}} numberOfLines={1}>
                  {selectedBreed.name}
                </Text>
                <TouchableOpacity onPress={closeDetails} hitSlop={10}>
                  <Ionicons name="close-circle" size={30} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                {selectedBreed.image?.url && (
                  <Image source={{ uri: selectedBreed.image.url }} style={styles.detailImage} contentFit="cover" />
                )}
                
                <Text category='h6' style={styles.sectionTitle}>Características Físicas</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoItem}>📏 {selectedBreed.height?.metric || 'N/A'} cm</Text>
                  <Text style={styles.infoItem}>⚖️ {selectedBreed.weight?.metric || 'N/A'} kg</Text>
                  <Text style={styles.infoItem}>❤️ {translateLifeSpan(selectedBreed.life_span)}</Text>
                </View>
                
                <Divider style={{marginVertical: 10, backgroundColor: '#E4E9F2'}}/>

                <Text category='h6' style={styles.sectionTitle}>Sobre a Raça</Text>
                <View style={{ gap: 8 }}>
                  <Text style={styles.value}>
                    <Text style={styles.label}>🧠 Temperamento: </Text>
                    {translateTemperament(selectedBreed.temperament)}
                  </Text>
                  
                  {selectedBreed.breed_group && (
                    <Text style={styles.value}>
                      <Text style={styles.label}>🏷️ Grupo: </Text>
                      {translateBreedGroup(selectedBreed.breed_group)}
                    </Text>
                  )}
                  
                  {selectedBreed.origin && (
                    <Text style={styles.value}>
                      <Text style={styles.label}>🌍 Origem: </Text>
                      {translateGeneric(selectedBreed.origin)}
                    </Text>
                  )}
                </View>
                
                <Button 
                  style={{ marginTop: 24 }} 
                  size='medium' 
                  status={favoritos.some(f => String(f.id) === String(selectedBreed.id)) ? 'danger' : 'primary'} 
                  onPress={() => { 
                    addFavorite({ 
                      id: selectedBreed.id, 
                      url: selectedBreed.image?.url || '', 
                      name: selectedBreed.name, 
                      breeds: [{ 
                        name: selectedBreed.name || '', 
                        temperament: selectedBreed.temperament, 
                        life_span: selectedBreed.life_span, 
                        breed_group: selectedBreed.breed_group, 
                        bred_for: selectedBreed.bred_for, 
                        origin: selectedBreed.origin, 
                        weight: selectedBreed.weight, 
                        height: selectedBreed.height 
                      }] 
                    }); 
                  }}
                >
                  {favoritos.some(f => String(f.id) === String(selectedBreed.id)) ? 'Remover Favorito' : 'Salvar ❤️'}
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
  headerContainer: { flexDirection: 'row', marginBottom: 12, gap: 10, alignItems: 'center' },
  searchInput: { flex: 1, borderRadius: 12 },
  filterButtonCustom: { 
    width: 50, 
    height: 48, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E4E9F2', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF' 
  },
  resultText: { marginBottom: 12, marginLeft: 4, fontSize: 14, color: '#888' },
  
  card: { marginBottom: 20, borderRadius: 16, paddingBottom: 8, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  noImg: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0', height: 200, borderRadius: 12, marginBottom: 12 },
  name: { fontWeight: 'bold', marginBottom: 6 },
  info: { marginBottom: 4, color: '#666' },
  buttonGroup: { flexDirection: 'row', marginTop: 12, gap: 8 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
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
  modalFooter: { paddingTop: 16, borderTopWidth: 1, borderColor: '#EEE', marginTop: 10 },
  
  filterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { marginBottom: 5, color: '#3366FF', fontSize: 12, fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  miniInput: { flex: 1 },
  dash: { marginHorizontal: 6, color: '#888' },

  accordionContainer: { marginTop: 10, borderWidth: 1, borderColor: '#EEE', borderRadius: 8, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#FAFAFA' },
  accordionContent: { padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
  
  checkboxItemCustom: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkboxLabel: { marginLeft: 10, fontSize: 14 },

  detailImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8 },
  infoItem: { fontSize: 14, fontWeight: '600', color: '#555' },
  sectionTitle: { marginTop: 8, marginBottom: 8, color: '#3366FF', fontWeight: 'bold', fontSize: 16 },
  value: { fontSize: 14, color: '#333', lineHeight: 22 },
});