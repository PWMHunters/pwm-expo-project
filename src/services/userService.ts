import Parse from "./parseConfig";

// Tipagem para login e cadastro
interface AuthData {
  email: string;
  pass: string;
}

// Tipagem para atualização de perfil
interface UpdateData {
  email?: string;
  password?: string;
  username?: string;
}

// 1. CREATE (Cadastrar)
export const registerUser = async ({ email, pass }: AuthData) => {
  // DEBUG: Verifica se os dados estão chegando corretamente
  console.log("Tentando cadastrar:", email, "Senha tamanho:", pass?.length);

  if (!email || !pass) {
    throw new Error("Email e senha são obrigatórios.");
  }

  try {
    const user = new Parse.User();
    // No Back4App, username é obrigatório e único. 
    // Usamos o email como username para simplificar.
    user.set("username", email.trim());
    user.set("email", email.trim());
    user.set("password", pass);
    
    await user.signUp();
    return user;
  } catch (error: any) {
    // Log do erro completo para você ver no console
    console.error("Erro no Parse SignUp:", error);

    // Tratamento de erros comuns do Parse
    if (error.code === 202) {
      throw new Error("Este nome de usuário já está em uso.");
    } else if (error.code === 203) {
      throw new Error("Este e-mail já está cadastrado.");
    } else {
      throw new Error(error.message);
    }
  }
};

// 2. READ (Login / Ler Usuário Atual)
export const loginUser = async ({ email, pass }: AuthData) => {
  try {
    const user = await Parse.User.logIn(email.trim(), pass);
    return user;
  } catch (error: any) {
    // Erro 101 = Inválido login/senha
    if (error.code === 101) {
      throw new Error("Email ou senha inválidos.");
    }
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  return await Parse.User.currentAsync();
};

// 3. UPDATE (Editar Perfil)
export const updateUserProfile = async (data: UpdateData) => {
  try {
    const user = await Parse.User.currentAsync();
    if (!user) throw new Error("Usuário não logado.");

    if (data.email) {
      user.set("email", data.email.trim());
      user.set("username", data.email.trim());
    }
    if (data.password) {
      user.set("password", data.password);
    }

    await user.save();
    return user;
  } catch (error: any) {
    throw new Error("Erro ao atualizar perfil: " + error.message);
  }
};

// 4. DELETE (Remover Conta)
export const deleteUserAccount = async () => {
  try {
    const user = await Parse.User.currentAsync();
    if (!user) throw new Error("Usuário não logado.");

    await user.destroy();
    await Parse.User.logOut();
  } catch (error: any) {
    throw new Error("Erro ao deletar conta: " + error.message);
  }
};

// LOGOUT
export const logoutUser = async () => {
  await Parse.User.logOut();
};