import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AbrigoDetalhe() {
  const router = useRouter();

  const {
    nome = '',
    descricao = '',
    endereco = '',
    fotos = '[]',
    cnpj = '',
    telefone = '',
    email = '',
    horario = '',
  } = useLocalSearchParams();

  const fotosArray = JSON.parse(fotos as string);

  return (
    <ScrollView style={styles.container}>

      {/* BOTÃO VOLTAR */}
      <TouchableOpacity style={styles.voltarBtn} onPress={() => router.back()}>
        <Text style={styles.voltarTexto}>⬅ Voltar</Text>
      </TouchableOpacity>

      {/* TÍTULO */}
      <Text style={styles.titulo}>{nome}</Text>
      <Text style={styles.descricao}>{descricao}</Text>

      {/* CARROSSEL DE FOTOS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {fotosArray.map((url: string, index: number) => (
          <Image key={index} source={{ uri: url }} style={styles.foto} />
        ))}
      </ScrollView>

      {/* INFORMAÇÕES */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitulo}>Informações do Abrigo</Text>

        <Text style={styles.infoLinha}>📍 Endereço:</Text>
        <Text style={styles.infoValor}>{endereco}</Text>

        <Text style={styles.infoLinha}>🕒 Horário de Funcionamento:</Text>
        <Text style={styles.infoValor}>{horario}</Text>

        <Text style={styles.infoLinha}>☎ Telefone:</Text>
        <Text style={styles.infoValor}>{telefone}</Text>

        <Text style={styles.infoLinha}>✉ E-mail:</Text>
        <Text style={styles.infoValor}>{email}</Text>

        <Text style={styles.infoLinha}>🧾 CNPJ:</Text>
        <Text style={styles.infoValor}>{cnpj}</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 30,
  },

  voltarBtn: {
    paddingVertical: 4,
    marginBottom: 10,
  },

  voltarTexto: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  descricao: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },

  carousel: {
    marginBottom: 22,
  },

  foto: {
    width: 260,
    height: 220,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: '#EEE',
  },

  infoBox: {
    backgroundColor: '#F2F6FF',
    padding: 16,
    borderRadius: 16,
  },

  infoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  infoLinha: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },

  infoValor: {
    fontSize: 15,
    color: '#444',
    marginLeft: 6,
  },
});
