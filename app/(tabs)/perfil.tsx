import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useUser } from '../../src/hooks/useUser';
import { useAuthStore } from '../../src/store/authStore';

export default function ProfileScreen() {
  const currentUser = useAuthStore((state) => state.user);

  const { deleteUser, isDeleting, logout } = useUser();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
    }
  }, [currentUser]);

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("Tem certeza absoluta? Sua conta será apagada permanentemente.");
      if (confirm) {
        deleteUser();
      }
      return;
    }

    Alert.alert(
      "Zona de Perigo",
      "Tem certeza absoluta? Sua conta será apagada.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "SIM, EXCLUIR",
          style: "destructive",
          onPress: () => {
            deleteUser();
          }
        }
      ]
    );
  };

  if (!currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color="#4a90e2" />
        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={styles.username}>{currentUser.username}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#666" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{currentUser.email}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { marginTop: 15 }]}>
          <Ionicons name="calendar-outline" size={20} color="#666" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.label}>Membro desde</Text>
            <Text style={styles.value}>
              {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('pt-BR') : 'Data desconhecida'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
          <Ionicons name="log-out-outline" size={20} color="#4a90e2" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sair do App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ?
            <ActivityIndicator color="red" /> :
            <>
              <Ionicons name="trash-outline" size={20} color="#FF3D71" style={{ marginRight: 8 }} />
              <Text style={styles.deleteText}>Excluir Minha Conta</Text>
            </>
          }
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20, width: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#333' },
  username: { color: '#666', marginTop: 5, fontSize: 16 },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 12, color: '#888', textTransform: 'uppercase', marginBottom: 2 },
  value: { fontSize: 16, color: '#333', fontWeight: '500' },

  footer: { width: '100%', alignItems: 'center' },

  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#4a90e2',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 15
  },
  logoutText: { color: '#4a90e2', fontSize: 16, fontWeight: '600' },

  deleteBtn: {
    flexDirection: 'row',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteText: { color: '#FF3D71', fontSize: 14, fontWeight: 'bold' }
});