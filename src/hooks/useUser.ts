import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStore } from '../../src/store/authStore'; // <--- 1. Importando a store correta
import { UserData, userService } from '../services/userService';

export const useUser = () => {
    
  const { setUser, logout } = useAuthStore();

  // 1. Hook de Login
  const loginMutation = useMutation({
    mutationFn: ({ user, pass }: { user: string; pass: string }) => 
      userService.login({username: user, password: pass}),
    onSuccess: (userData) => {
      setUser(userData); 
      router.replace('/(tabs)/home'); 
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Falha ao logar: " + error.message);
    }
  });

  // 2. Hook de Cadastro (Create)
  const signUpMutation = useMutation({
    mutationFn: (data: UserData) => userService.signUp(data),
    onSuccess: (userData) => {
      setUser(userData);
      router.replace('/(tabs)/home');
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Falha ao cadastrar: " + error.message);
    }
  });

  // 3. Hook de Atualização (Update)
  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserData>) => userService.updateUser(data),
    onSuccess: (userData) => {
      setUser(userData); 
      Alert.alert("Sucesso", "Perfil atualizado!");
    },
    onError: (error: any) => {
      Alert.alert("Erro ao atualizar", error.message);
    }
  });

  // 4. Hook de Deletar Conta 
  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      logout();
      router.replace('/login');
      Alert.alert("Conta excluída", "Seus dados foram removidos.");
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Não foi possível excluir: " + error.message);
    }
  });

  // 5. Logout
  const logoutMutation = useMutation({
    mutationFn: userService.logout,
    onSuccess: () => {
      logout();
      router.replace('/login');
    }
  });

  return {
    login: loginMutation.mutate,
    isLoadingLogin: loginMutation.isPending,
    signUp: signUpMutation.mutate,
    isLoadingSignUp: signUpMutation.isPending,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending, 
    deleteUser: deleteMutation.mutate,    
    isDeleting: deleteMutation.isPending, 
    
    logout: logoutMutation.mutate
  };
};