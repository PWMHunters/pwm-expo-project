import React, { useEffect, useState, useContext, useMemo } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, ScrollView, Pressable, Keyboard, Modal } from 'react-native';
import { Layout, Text, Card, Button, Spinner, Input, Divider, CheckBox } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/dogApi';
import { FavoritesContext, Dog } from '../context/FavoritesContext';
import { translateTemperament, translateBreedGroup, translateGeneric, translateLifeSpan } from '../../src/utils/dogUtils';

const getIconColor = (props: any) => props?.style?.tintColor || '#8F9BB3';

const SearchIcon = (props: any) => <Ionicons name="search-outline" size={24} color={getIconColor(props)} />;
const FilterIcon = (props: any) => <Ionicons name="funnel-outline" size={24} color={getIconColor(props)} />;
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
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpanded(!expanded)}>
        <Text category='s2' style={styles.label}>{title} {selectedValues.length > 0 ? `(${selectedValues.length})` : ''}</Text>
        <Ionicons name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#888" />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionContent}>
          <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
            {options.map((opt: string) => (
              <CheckBox key={opt} style={styles.checkboxItem} checked={selectedValues.includes(opt)} onChange={() => onToggle(opt)}>
                {opt}
              </CheckBox>
            ))}
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

    breeds.forEach(b => {
      if (b.breed_group) groups.add(translateBreedGroup(b.breed_group));
      if (b.temperament) {
        const translatedTemp = translateTemperament(b.temperament); 
        translatedTemp.split(', ').forEach(t => temperaments.add(t.trim()));
      }
      if (b.origin) {
        const translatedOrigin = translateGeneric(b.origin);
        translatedOrigin.split(', ').forEach(o => { if(o && o !== 'Desconhecido') origins.add(o.trim()); });
      }
      if (b.bred_for) {
        const translatedBred = translateGeneric(b.bred_for);
        bredFors.add(translatedBred);
      }
    });
    return {
      groups: Array.from(groups).sort(),
      temperaments: Array.from(temperaments).sort(),
      origins: Array.from(origins).sort(),
      bredFors: Array.from(bredFors).sort()
    };
  }, [breeds]);

  const openDetails = (breed: Dog) => {
    setSelectedBreed(breed);
    setDetailsModalVisible(true);
  };
  const closeFilters = () => { Keyboard.dismiss(); setFilterModalVisible(false); };
  const closeDetails = () => setDetailsModalVisible(false);

  const toggleSelection = (list: string[], setList: Function, value: string) => {
    if (list.includes(value)) setList(list.filter(item => item !== value));
    else setList([...list, value]);
  };

  const filteredBreeds = breeds.filter((breed) => {
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

  const renderItem = ({ item }: { item: Dog }) => {
    const isFavorito = favoritos.some((f) => String(f.id) === String(item.id));
    const lifeSpanTraduzido = translateLifeSpan(item.life_span);
    const temperamentoTraduzido = translateTemperament(item.temperament);
    const resumoTemperamento = temperamentoTraduzido.length > 50 ? temperamentoTraduzido.substring(0, 50) + '...' : temperamentoTraduzido;

    return (
      <Card style={styles.card}>
        <TouchableOpacity onPress={() => openDetails(item)}>
          {item.image?.url ? (
            <Image source={{ uri: item.image.url }} style={styles.image} />
          ) : (
            <Layout style={[styles.image, styles.noImg]}><Text appearance="hint">Sem imagem</Text></Layout>
          )}
        </TouchableOpacity>
        <Text category="h6" style={styles.name}>{item.name}</Text>
        {item.temperament && <Text appearance="hint" category='c1' style={styles.info}>🧠 {resumoTemperamento}</Text>}
        {item.life_span && <Text appearance="hint" category='c1' style={styles.info}>❤️ Vida: {lifeSpanTraduzido}</Text>}
        <View style={styles.buttonGroup}>
          <Button style={{flex: 1, marginRight: 8}} size='small' appearance='outline' accessoryLeft={InfoIcon} onPress={() => openDetails(item)}>Detalhes</Button>
          <Button style={{flex: 1}} size='small' status={isFavorito ? 'danger' : 'primary'} onPress={() => addFavorite({id: item.id, url: item.image?.url || '', name: item.name, breeds: [{ name: item.name || '', temperament: item.temperament, life_span: item.life_span, breed_group: item.breed_group, bred_for: item.bred_for, origin: item.origin, weight: item.weight, height: item.height }]})}>
            {isFavorito ? 'Salvo' : 'Salvar'}
          </Button>
        </View>
      </Card>
    );
  };

  if (loading) return <Layout style={styles.loading}><Spinner size="giant" /><Text category="s1" style={{ marginTop: 12 }}>Carregando raças...</Text></Layout>;

  return (
    <View style={styles.mainWrapper}>
      <Image source={require('../../assets/images/footprints.gif')} style={styles.backgroundGif} resizeMode="cover" />
      
      <Layout style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={styles.headerContainer}>
          <Input style={styles.searchInput} placeholder='Buscar raça...' value={searchText} accessoryLeft={SearchIcon} onChangeText={setSearchText} />
          <Button style={styles.filterButton} appearance='outline' accessoryLeft={FilterIcon} onPress={() => setFilterModalVisible(true)} />
        </View>
        <Text category="h6" style={styles.resultText}>{filteredBreeds.length} raças encontradas</Text>
        <FlatList data={filteredBreeds} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false} />

        {filterModalVisible && (
          <Modal visible={filterModalVisible} animationType="fade" transparent onRequestClose={closeFilters}>
            <Pressable style={styles.modalBackdrop} onPress={closeFilters}>
              <Pressable style={[styles.modalCard, { maxHeight: '90%' }]} onPress={(e) => e.stopPropagation()}>
                <Card disabled={true} style={{flex: 1, borderRadius: 16, borderWidth: 0}}>
                  <View style={styles.modalHeader}><Text category='h6'>Filtros Avançados</Text></View>
                  <ScrollView showsVerticalScrollIndicator={true}>
                    <View style={styles.filterRow}>
                      <View style={{ flex: 1, marginRight: 8 }}><Text category='s2' style={styles.label}>Vida (anos)</Text><View style={{ flexDirection: 'row', alignItems: 'center' }}><Input style={{ flex: 1 }} placeholder='Min' keyboardType='numeric' value={minLife} onChangeText={setMinLife} size='small' /><Text style={{ marginHorizontal: 4 }}>-</Text><Input style={{ flex: 1 }} placeholder='Max' keyboardType='numeric' value={maxLife} onChangeText={setMaxLife} size='small' /></View></View>
                      <View style={{ flex: 1 }}><Text category='s2' style={styles.label}>Peso (kg)</Text><View style={{ flexDirection: 'row', alignItems: 'center' }}><Input style={{ flex: 1 }} placeholder='Min' keyboardType='numeric' value={minWeight} onChangeText={setMinWeight} size='small' /><Text style={{ marginHorizontal: 4 }}>-</Text><Input style={{ flex: 1 }} placeholder='Max' keyboardType='numeric' value={maxWeight} onChangeText={setMaxWeight} size='small' /></View></View>
                    </View>
                    <View style={[styles.filterRow, { marginTop: 12 }]}>
                      <View style={{ flex: 1, marginRight: 8 }}><Text category='s2' style={styles.label}>Altura (cm)</Text><View style={{ flexDirection: 'row', alignItems: 'center' }}><Input style={{ flex: 1 }} placeholder='Min' keyboardType='numeric' value={minHeight} onChangeText={setMinHeight} size='small' /><Text style={{ marginHorizontal: 4 }}>-</Text><Input style={{ flex: 1 }} placeholder='Max' keyboardType='numeric' value={maxHeight} onChangeText={setMaxHeight} size='small' /></View></View>
                    </View>
                    <Divider style={{ marginVertical: 16 }}/>
                    <MultiSelectAccordion title="Grupos de Raça" options={options.groups} selectedValues={selectedGroups} onToggle={(val: string) => toggleSelection(selectedGroups, setSelectedGroups, val)} />
                    <MultiSelectAccordion title="Temperamento" options={options.temperaments} selectedValues={selectedTemperaments} onToggle={(val: string) => toggleSelection(selectedTemperaments, setSelectedTemperaments, val)} />
                    <MultiSelectAccordion title="Origem" options={options.origins} selectedValues={selectedOrigins} onToggle={(val: string) => toggleSelection(selectedOrigins, setSelectedOrigins, val)} />
                    <MultiSelectAccordion title="Criado Para" options={options.bredFors} selectedValues={selectedBredFor} onToggle={(val: string) => toggleSelection(selectedBredFor, setSelectedBredFor, val)} />
                    <View style={{ height: 20 }} />
                  </ScrollView>
                  <View style={{ paddingTop: 10, borderTopWidth: 1, borderColor: '#EEE' }}>
                    <Button style={{ marginTop: 10 }} onPress={closeFilters}>Ver Resultados</Button>
                    <Button style={{ marginTop: 10 }} appearance='ghost' status='basic' onPress={() => { setSelectedGroups([]); setSelectedTemperaments([]); setSelectedOrigins([]); setSelectedBredFor([]); setMinLife(''); setMaxLife(''); setMinWeight(''); setMaxWeight(''); setMinHeight(''); setMaxHeight(''); closeFilters(); }}>Limpar Filtros</Button>
                  </View>
                </Card>
              </Pressable>
            </Pressable>
          </Modal>
        )}

        {detailsModalVisible && selectedBreed && (
          <Modal visible={detailsModalVisible} animationType="fade" transparent onRequestClose={closeDetails}>
            <Pressable style={styles.modalBackdrop} onPress={closeDetails}>
              <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                  <View style={styles.modalHeader}>
                    <Text category='h5' style={{fontWeight: 'bold', flex: 1}}>{selectedBreed.name}</Text>
                    <TouchableOpacity onPress={closeDetails}><Ionicons name="close-outline" size={28} color="#000" /></TouchableOpacity>
                  </View>
                  {selectedBreed.image?.url && <Image source={{ uri: selectedBreed.image.url }} style={styles.detailImage} />}
                  <Text category='h6' style={styles.sectionTitle}>Características Físicas</Text>
                  <View style={styles.detailRow}><Text category='s1'>📏 Altura:</Text><Text>{selectedBreed.height?.metric ? `${selectedBreed.height.metric} cm` : 'N/A'}</Text></View>
                  <View style={styles.detailRow}><Text category='s1'>⚖️ Peso:</Text><Text>{selectedBreed.weight?.metric ? `${selectedBreed.weight.metric} kg` : 'N/A'}</Text></View>
                  <View style={styles.detailRow}><Text category='s1'>❤️ Vida:</Text><Text>{translateLifeSpan(selectedBreed.life_span)}</Text></View>
                  <Divider style={{marginVertical: 12}}/>
                  <Text category='h6' style={styles.sectionTitle}>Sobre a Raça</Text>
                  <View style={styles.detailBlock}><Text category='s1'>🧠 Temperamento:</Text><Text appearance='hint'>{translateTemperament(selectedBreed.temperament)}</Text></View>
                  {selectedBreed.breed_group && <View style={styles.detailBlock}><Text category='s1'>🏷️ Grupo:</Text><Text appearance='hint'>{translateBreedGroup(selectedBreed.breed_group)}</Text></View>}
                  {selectedBreed.bred_for && <View style={styles.detailBlock}><Text category='s1'>🛠️ Criado para:</Text><Text appearance='hint'>{translateGeneric(selectedBreed.bred_for)}</Text></View>}
                  {selectedBreed.origin && <View style={styles.detailBlock}><Text category='s1'>🌍 Origem:</Text><Text appearance='hint'>{translateGeneric(selectedBreed.origin)}</Text></View>}
                  <Button style={{ marginTop: 24, marginBottom: 10 }} status={favoritos.some(f => String(f.id) === String(selectedBreed.id)) ? 'danger' : 'primary'} onPress={() => addFavorite({ id: selectedBreed.id, url: selectedBreed.image?.url || '', name: selectedBreed.name, breeds: [{ name: selectedBreed.name || '', temperament: selectedBreed.temperament, life_span: selectedBreed.life_span, breed_group: selectedBreed.breed_group, bred_for: selectedBreed.bred_for, origin: selectedBreed.origin, weight: selectedBreed.weight, height: selectedBreed.height }] })}>
                    {favoritos.some(f => String(f.id) === String(selectedBreed.id)) ? 'Salvo' : 'Salvar nos Favoritos ❤️'}
                  </Button>
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
  
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { width: '100%', borderRadius: 16, flexShrink: 1 },
  modalContent: { width: '100%', backgroundColor: '#FFF', borderRadius: 16, padding: 20, maxHeight: '85%', elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { marginBottom: 8, marginTop: 4, color: '#888', fontWeight: 'bold', fontSize: 12 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  accordionContainer: { marginBottom: 10, borderWidth: 1, borderColor: '#EEE', borderRadius: 8, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#FAFAFA' },
  accordionContent: { padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
  checkboxItem: { marginVertical: 4 },
  detailImage: { width: '100%', height: 250, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
  sectionTitle: { marginTop: 8, marginBottom: 8, color: '#3366FF', fontWeight: 'bold', fontSize: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 4 },
  detailBlock: { marginBottom: 10 }
});