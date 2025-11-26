import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useUser } from '../src/hooks/useUser'; // <--- Importando nosso Hook
// Removemos imports diretos do serviço e do router (o hook já faz o redirect)

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Puxando tudo do nosso Hook poderoso
  const { login, signUp, isLoadingLogin, isLoadingSignUp } = useUser();

  const isLoading = isLoadingLogin || isLoadingSignUp;

  const handleAuth = () => {
    if (!email || !password) return Alert.alert("Erro", "Preencha todos os campos");

    if (isRegistering) {
      // Como o Parse exige Username, usamos o email como username
      signUp({ 
        username: email, 
        email: email, 
        password: password 
      });
    } else {
      login({ user: email, pass: password });
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
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        value={password} 
        onChangeText={setPassword}
        secureTextEntry 
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button 
          title={isRegistering ? "Cadastrar" : "Entrar"} 
          onPress={handleAuth} 
        />
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