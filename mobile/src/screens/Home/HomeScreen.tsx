import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';

type RootStackParamList = {
  Home: undefined;
  FadigaZero: undefined;
  ViaAlerta: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Olá, Motorista!</Text>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>O que você deseja fazer agora?</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('FadigaZero')}
        >
          <Card style={[styles.moduleCard, { borderLeftColor: colors.primary, borderLeftWidth: 4 }]}>
            <View style={styles.titleContainer}>
              <Ionicons name="flash" size={24} color={colors.primary} style={styles.icon} />
              <Text style={styles.moduleTitle}>Teste de Prontidão</Text>
            </View>
            <Text style={styles.moduleDesc}>
              Faça um teste rápido de reflexos para garantir que você não está com fadiga extrema antes de dirigir.
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('ViaAlerta')}
          style={styles.spacing}
        >
          <Card style={[styles.moduleCard, { borderLeftColor: colors.warning, borderLeftWidth: 4 }]}>
            <View style={styles.titleContainer}>
              <Ionicons name="warning" size={24} color={colors.warning} style={styles.icon} />
              <Text style={styles.moduleTitle}>Feed Via Alerta</Text>
            </View>
            <Text style={styles.moduleDesc}>
              Acompanhe reportes de perigos na via ou crie um novo reporte para avisar outros motoristas.
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoutButton: {
    padding: 4,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  moduleCard: {
    paddingVertical: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  moduleTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  moduleDesc: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  spacing: {
    marginTop: 16,
  }
});
