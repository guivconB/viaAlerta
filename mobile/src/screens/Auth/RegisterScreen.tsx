import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { signIn } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await api.post('/users', { 
        name, 
        email, 
        password, 
        birthday: new Date().toISOString() 
      });
      const response = await api.post('/users/login', { email, password });
      if (response.data.token) {
        await signIn(response.data.token);
        // A navegação condicional reagirá à mudança do token em AuthContext e abrirá MainTabs automaticamente.
      } else {
        alert('Conta criada, mas erro ao fazer login automático.');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Criar Conta</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Junte-se à comunidade viaAlerta</Text>

        <View style={styles.form}>
          <Input 
            label="Nome Completo" 
            placeholder="Digite seu nome" 
            value={name}
            onChangeText={(text) => { setName(text); setErrors(prev => ({...prev, name: ''})); }}
            autoCapitalize="words"
            error={errors.name}
          />
          <Input 
            label="Email" 
            placeholder="Digite seu email" 
            value={email}
            onChangeText={(text) => { setEmail(text); setErrors(prev => ({...prev, email: ''})); }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input 
            label="Senha" 
            placeholder="Crie uma senha segura" 
            value={password}
            onChangeText={(text) => { setPassword(text); setErrors(prev => ({...prev, password: ''})); }}
            secureTextEntry
            error={errors.password}
          />
        </View>

        <Button 
          title="Cadastrar" 
          onPress={handleRegister} 
          loading={loading}
        />

        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.surface }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>OU</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.surface }]} />
        </View>

        <Button 
          title="Já tem conta? Entrar" 
          onPress={() => navigation.goBack()} 
          variant="outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: 'bold',
  }
});
