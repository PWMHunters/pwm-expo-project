import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { UserData, userService } from '../services/userService';

export const useUser = () => {
  const { setUser, logout } = useAuthStore();

  // 1. Login
  const loginMutation = useMutation({
    mutationFn: ({ user, pass }: { user: string; pass: string }) =>
      userService.login({ username: user, password: pass }),
    onSuccess: (userData) => {
      setUser(userData);
      router.replace('/(tabs)/home');
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Falha ao logar: " + error.response?.data?.error || error.message);
    }
  });

  // 2. Cadastro
  const signUpMutation = useMutation({
    mutationFn: (data: UserData) => userService.signUp(data),
    onSuccess: (userData) => {
      setUser(userData);
      router.replace('/(tabs)/home');
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Falha ao cadastrar: " + error.response?.data?.error || error.message);
    }
  });

  // 3. Atualização
  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserData>) => userService.updateUser(data),
    onSuccess: (userData) => {
      setUser(userData);
      Alert.alert("Sucesso", "Perfil atualizado!");
    },
    onError: (error: any) => {
      Alert.alert("Erro ao atualizar", error.response?.data?.error || error.message);
    }
  });

  // 4. Deletar conta
  const deleteMutation = useMutation({
    mutationFn: () => {
      const user = useAuthStore.getState().user;
      if (!user?.sessionToken) throw new Error("Usuário não logado");
      return userService.deleteUser(user.sessionToken);
    },
    onSuccess: () => {
      logout();
      router.replace('/login');
      Alert.alert("Conta excluída", "Seus dados foram removidos.");
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Não foi possível excluir: " + error.response?.data?.error || error.message);
    }
  });

  // 5. Logout
  const logoutMutation = useMutation({
    mutationFn: () => {
      const user = useAuthStore.getState().user;
      if (!user?.sessionToken) return Promise.resolve();
      return userService.logout(user.sessionToken);
    },
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