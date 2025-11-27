import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // <--- Adicionei Platform

import { xParseSessionTokenKey } from '@/src/services/config';
import { useUser } from '../../src/hooks/useUser';
import { userService } from '../../src/services/userService';
import { useAuthStore } from '../../src/store/authStore';


export default function ProfileScreen() {
  const currentUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  
  const { updateUser, isUpdating, deleteUser, isDeleting, logout } = useUser();

  const [formEmail, setFormEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingRecovery, setIsLoadingRecovery] = useState(false);

  useEffect(() => {
    const recoverSession = async () => {
      if (!currentUser) {
        setIsLoadingRecovery(true);
        try {
          const diskUser = await userService.getCurrentUser(xParseSessionTokenKey);
          if (diskUser) {
            setUser(diskUser);
          } else {
            router.replace('/login');
          }
        } catch (error) {
          router.replace('/login');
        } finally {
          setIsLoadingRecovery(false);
        }
      }
    };
    recoverSession();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      setFormEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleUpdate = () => {
    const updates: any = {};
    if (formEmail !== currentUser?.email) updates.email = formEmail;
    if (newPassword) updates.password = newPassword;

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }
    updateUser(updates, { onSuccess: () => { setIsEditing(false); setNewPassword(''); }});
  };

  const handleDeleteAccount = () => {
    console.log("Tentando excluir conta...");

    if (Platform.OS === 'web') {
      const confirm = window.confirm("Tem certeza absoluta? Sua conta será apagada permanentemente.");
      if (confirm) {
        deleteUser(xParseSessionTokenKey);
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
             console.log("Confirmado no Mobile. Deletando...");
             deleteUser(xParseSessionTokenKey);
          } 
        }
      ]
    );
  };

  if (!currentUser || isLoadingRecovery) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" 
    >
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color="#4a90e2" />
        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={{color: '#999', marginTop: 5}}>{currentUser.username}</Text> 
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={formEmail}
          onChangeText={setFormEmail}
          editable={isEditing}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {isEditing && (
          <>
            <Text style={styles.label}>Nova Senha</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Vazio para manter atual"
              secureTextEntry
            />
          </>
        )}

        {isEditing ? (
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={() => { setIsEditing(false); setFormEmail(currentUser.email); setNewPassword(''); }}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleUpdate} disabled={isUpdating}>
              {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Salvar</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.button, styles.editBtn]} onPress={() => setIsEditing(true)}>
            <Text style={styles.btnText}>Editar Dados</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => logout(xParseSessionTokenKey)}>
          <Text style={styles.logoutText}>Sair do App</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
           {isDeleting ? 
             <ActivityIndicator color="red" /> : 
             <Text style={styles.deleteText}>Excluir Minha Conta</Text>
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
  header: { alignItems: 'center', marginBottom: 20, marginTop: 20, width: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#333' },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 3 },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  disabledInput: { backgroundColor: '#f9f9f9', color: '#888', borderColor: '#eee' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { padding: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  editBtn: { backgroundColor: '#4a90e2', marginTop: 20 },
  saveBtn: { backgroundColor: '#28a745', flex: 0.48 },
  cancelBtn: { backgroundColor: '#999', flex: 0.48 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { width: '100%', marginTop: 20, alignItems: 'center',  }, 
  logoutBtn: { padding: 15, width: '100%', alignItems: 'center', marginBottom: 10 },
  logoutText: { color: '#4a90e2', fontSize: 16, fontWeight: '600' },
  deleteBtn: { padding: 15, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  deleteText: { color: 'red', fontSize: 14, fontWeight: 'bold' }
});