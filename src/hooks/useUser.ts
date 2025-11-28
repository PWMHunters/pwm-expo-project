import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { UserData, userService } from '../services/userService';

export const useUser = () => {
  const { setUser, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ user, pass }: { user: string; pass: string }) =>
      userService.login({ username: user, password: pass }),
    onSuccess: (userData) => {
      console.log("Login OK. Token:", userData.sessionToken);
      setUser(userData);
      router.replace('/(tabs)/home');
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Falha ao logar: " + (error.response?.data?.error || error.message));
    }
  });

  const signUpMutation = useMutation({
    mutationFn: (data: UserData) => userService.signUp(data),
    onSuccess: (userData) => {
      setUser(userData);
      router.replace('/(tabs)/home');
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Falha ao cadastrar: " + (error.response?.data?.error || error.message));
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserData>) => {
      const user = useAuthStore.getState().user;
      if (!user?.sessionToken) throw new Error("Usuário não logado");
      return userService.updateUser({ ...data, sessionToken: user.sessionToken });
    },
    onSuccess: (userData) => {
      const currentUser = useAuthStore.getState().user;
      setUser({ ...currentUser, ...userData });
      Alert.alert("Sucesso", "Perfil atualizado!");
    },
    onError: (error: any) => {
      Alert.alert("Erro ao atualizar", error.response?.data?.error || error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      const user = useAuthStore.getState().user;

      console.log("Deletando usuário:", user?.objectId); // Debug

      if (!user?.sessionToken || !user?.objectId) {
        throw new Error("Sessão inválida ou ID de usuário não encontrado.");
      }

      return userService.deleteUser(user.objectId, user.sessionToken);
    },
    onSuccess: () => {
      logout();
      router.replace('/login');
      Alert.alert("Conta excluída", "Seus dados foram removidos com sucesso.");
    },
    onError: (error: any) => {
      console.error("Erro detalhado:", error.response?.data);
      Alert.alert("Erro", "Não foi possível excluir: " + (error.response?.data?.error || error.message));
    }
  });

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