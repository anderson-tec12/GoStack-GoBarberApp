import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface SignIncredentials {
  email: string;
  password: string;
}

interface AuthContextState {
  user: User;
  signIn(credencials: SignIncredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
  loading: boolean;
}

interface AuthState {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    async function LoadStorageData(): Promise<void> {
      // const token = await AsyncStorage.getItem('@GoBarber:token');
      // const user = await AsyncStorage.getItem('@GoBarber:user');

      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;
        setData({ token: token[1], user: JSON.parse(user[1]) });
        // return { token, user: JSON.parse(user) };
      }

      setloading(false);

      // return {} as AuthState;
    }

    LoadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    console.log('response', response.data);

    const { token, user } = response.data;

    // await AsyncStorage.setItem('@GoBarber:token', token);
    // await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    // await AsyncStorage.removeItem('@GoBarber:token');
    // await AsyncStorage.removeItem('@GoBarber:user');

    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (updateData: Partial<User>) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(updateData));

      setData({
        token: data.token, // permanece o mesmo não atualizo
        user: {
          ...data.user, // joga todas as informaçoes do usuario
          ...updateData, // sobres escreve so o que foi atualizado
        },
      });
    },
    [data.token, data.user],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, loading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('UseAuth must be withing a AuthProvider');
  }

  return context;
};
