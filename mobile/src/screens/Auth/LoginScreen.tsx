import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';
// import { Ionicons } from '@expo/vector-icons'; // We will add icons next

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ForgotPassword: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { signIn } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data.token) {
        await signIn(response.data.token);
      } else {
        alert('Erro ao fazer login. Token não retornado.');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Login</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Bem-vindo de volta! Insira suas credenciais.
        </Text>
      </View>

      <View style={styles.form}>
        <Input 
          label="E-mail"
          placeholder="seu@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => { setEmail(text); setErrors(prev => ({...prev, email: ''})); }}
          autoCapitalize="none"
          error={errors.email}
        />
        
        <Input 
          label="Senha"
          placeholder="Sua senha secreta"
          secureTextEntry
          value={password}
          onChangeText={(text) => { setPassword(text); setErrors(prev => ({...prev, password: ''})); }}
          error={errors.password}
        />
        
        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => Alert.alert('Recuperar Senha', 'Entre em contato com o suporte pelo e-mail: suporte@viaalerta.app')}
        >
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <Button 
          title="Entrar" 
          onPress={handleLogin} 
          loading={loading}
          style={styles.loginButton}
        />
        
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.surface }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>OU</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.surface }]} />
        </View>

        <Button 
          title="Criar nova conta" 
          onPress={() => navigation.navigate('Register')} 
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontWeight: 'bold',
  },
  loginButton: {
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
