import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { loginUser, registerUser } from '../src/services/userService';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) return Alert.alert("Erro", "Preencha todos os campos");
    
    setLoading(true);
    try {
      if (isRegistering) {
        await registerUser({ email, pass: password });
        Alert.alert("Sucesso", "Conta criada! Acessando...");
        router.replace('/(tabs)'); // Vai para o app
      } else {
        await loginUser({ email, pass: password });
        router.replace('/(tabs)'); // Vai para o app
      }
    } catch (error: any) {
      Alert.alert("Erro", "Falha na autenticação: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdotePet Login</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        value={password} 
        onChangeText={setPassword}
        secureTextEntry 
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title={isRegistering ? "Cadastrar" : "Entrar"} onPress={handleAuth} />
      )}

      <Text style={styles.link} onPress={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Já tem conta? Clique para Entrar" : "Novo aqui? Clique para Cadastrar"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  link: { marginTop: 20, color: '#007AFF', textAlign: 'center' }
});