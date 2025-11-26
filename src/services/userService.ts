import Parse from 'parse/react-native';
// Certifique-se que o Parse foi inicializado no parseConfig.ts

// Definição da interface do Usuário
export interface UserData {
  objectId?: string;      // <--- Adicionado: O ID do Parse
  sessionToken?: string;  // <--- Adicionado: Token de sessão
  createdAt?: string;     // <--- Adicionado: Data de criação
  username: string;
  email: string;
  password?: string;
}

export const userService = {
  // CREATE (SignUp)
  async signUp(data: UserData) {
    const user = new Parse.User();
    user.set('username', data.username);
    user.set('password', data.password);
    user.set('email', data.email);
    

    try {
      const result = await user.signUp();
      // Correção do erro de tipagem: cast para unknown primeiro
      return result.toJSON() as unknown as UserData;
    } catch (error) {
      throw error;
    }
  },

  // READ (Login)
  async login(username: string, pass: string) {
    try {
      const user = await Parse.User.logIn(username, pass);
      return user.toJSON() as unknown as UserData;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    const currentUser = await Parse.User.currentAsync();
    return currentUser ? (currentUser.toJSON() as unknown as UserData) : null;
  },

  // UPDATE
  async updateUser(data: Partial<UserData>) {
    const user = await Parse.User.currentAsync();
    if (!user) throw new Error('Usuário não logado');

    if (data.username) user.set('username', data.username);
    if (data.email) user.set('email', data.email)
    if (data.password) {
      user.set('password', data.password);
    }

    try {
      const result = await user.save();
      return { 
        ...user.toJSON(), 
        ...data 
      } as unknown as UserData;
    } catch (error) {
      throw error;
    }
  },

  // DELETE (Excluir conta)
  async deleteUser() {
    const user = await Parse.User.currentAsync();
    if (!user) throw new Error('Usuário não logado');
    
    try {
      await user.fetch();
      await user.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  async logout() {
    return await Parse.User.logOut();
  }
};