import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getCurrentUser, updateUserProfile, deleteUserAccount, logoutUser } from '../../src/services/userService';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = await getCurrentUser();
    if (user) {
      setEmail(user.get('email'));
    }
  };

  // Ação de Editar (UPDATE)
  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Cria objeto apenas com o que foi preenchido
      const updates: any = {};
      if (email) updates.email = email;
      if (newPassword) updates.password = newPassword;

      await updateUserProfile(updates);
      Alert.alert("Sucesso", "Perfil atualizado!");
      setIsEditing(false);
      setNewPassword(''); // Limpa campo de senha por segurança
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ação de Deletar (DELETE)
  const handleDeleteAccount = () => {
    Alert.alert(
      "Tem certeza?",
      "Essa ação não pode ser desfeita. Sua conta será excluída permanentemente.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir Conta", 
          style: "destructive", 
          onPress: async () => {
            setLoading(true);
            try {
              await deleteUserAccount();
              router.replace('/login');
            } catch (error: any) {
              Alert.alert("Erro", error.message);
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color="#4a90e2" />
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
          autoCapitalize="none"
        />

        {isEditing && (
          <>
            <Text style={styles.label}>Nova Senha (opcional)</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Deixe em branco para manter a atual"
              secureTextEntry
            />
          </>
        )}

        {/* Botões de Ação Principal */}
        {isEditing ? (
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={() => setIsEditing(false)}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleUpdate} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Salvar</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.button, styles.editBtn]} onPress={() => setIsEditing(true)}>
            <Text style={styles.btnText}>Editar Dados</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair do App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Excluir Minha Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
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

  footer: { width: '100%', marginTop: 40, alignItems: 'center' },
  logoutBtn: { padding: 15, width: '100%', alignItems: 'center', marginBottom: 10 },
  logoutText: { color: '#4a90e2', fontSize: 16, fontWeight: '600' },
  deleteBtn: { padding: 15 },
  deleteText: { color: 'red', fontSize: 14 }
});