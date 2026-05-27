import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Card } from '../../components/Card';

type RootStackParamList = {
  Início: undefined;
  Testes: undefined;
  Mapa: undefined;
  Perfil: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>Olá, Motorista!</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>O que você deseja fazer agora?</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('Testes')}
          style={styles.touchableArea}
        >
          <Card style={[styles.moduleCard, { borderLeftColor: colors.primary, borderLeftWidth: 4 }]}>
            <View style={styles.titleContainer}>
              <Ionicons name="flash" size={24} color={colors.primary} style={styles.icon} />
              <Text style={[styles.moduleTitle, { color: colors.textPrimary }]}>Teste de Prontidão</Text>
            </View>
            <Text style={[styles.moduleDesc, { color: colors.textMuted }]}>
              Faça um teste rápido de reflexos para garantir que você não está com fadiga extrema antes de dirigir.
            </Text>
          </Card>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.surface }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>OU</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.surface }]} />
        </View>

        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('Mapa')}
          style={styles.touchableArea}
        >
          <Card style={[styles.moduleCard, { borderLeftColor: colors.warning, borderLeftWidth: 4 }]}>
            <View style={styles.titleContainer}>
              <Ionicons name="warning" size={24} color={colors.warning} style={styles.icon} />
              <Text style={[styles.moduleTitle, { color: colors.textPrimary }]}>Feed Via Alerta</Text>
            </View>
            <Text style={[styles.moduleDesc, { color: colors.textMuted }]}>
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  touchableArea: {
    flex: 1,
  },
  moduleCard: {
    flex: 1,
    justifyContent: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  moduleDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
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
