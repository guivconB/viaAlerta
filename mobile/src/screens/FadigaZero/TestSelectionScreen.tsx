import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Card } from '../../components/Card';

type RootStackParamList = {
  Home: undefined;
  FadigaZero: undefined;
  ReflexTest: undefined;
  SequenceTest: undefined;
  StroopTest: undefined;
  History: undefined;
};

type TestSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FadigaZero'>;

interface Props {
  navigation: TestSelectionScreenNavigationProp;
}

export const TestSelectionScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Início</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Fadiga Zero</Text>
        <Text style={styles.subtitle}>Selecione um teste cognitivo para avaliar seu estado de alerta:</Text>
      </View>

      <View style={styles.content}>
        {/* Teste 1: Tempo de Reação */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('ReflexTest')}
          style={styles.cardContainer}
        >
          <Card style={[styles.testCard, { borderLeftColor: colors.success, borderLeftWidth: 4 }]}>
            <View style={styles.row}>
              <View style={styles.iconBackground}>
                <Ionicons name="flash" size={24} color={colors.success} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.testTitle}>Tempo de Reação Visual</Text>
                <Text style={styles.testDesc}>
                  Toque na tela no instante em que ela mudar para verde. Mede seu tempo de reação simples.
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Teste 2: Sequência de Memória */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('SequenceTest')}
          style={styles.cardContainer}
        >
          <Card style={[styles.testCard, { borderLeftColor: colors.primary, borderLeftWidth: 4 }]}>
            <View style={styles.row}>
              <View style={styles.iconBackground}>
                <Ionicons name="grid" size={24} color={colors.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.testTitle}>Sequência de Memória</Text>
                <Text style={styles.testDesc}>
                  Memorize e repita a sequência de luzes e sons. Avalia sua memória de curto prazo e atenção.
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Teste 3: Teste de Stroop */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('StroopTest')}
          style={styles.cardContainer}
        >
          <Card style={[styles.testCard, { borderLeftColor: colors.warning, borderLeftWidth: 4 }]}>
            <View style={styles.row}>
              <View style={styles.iconBackground}>
                <Ionicons name="git-compare" size={24} color={colors.warning} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.testTitle}>Teste de Stroop</Text>
                <Text style={styles.testDesc}>
                  Selecione a cor da fonte, ignorando o significado da palavra escrita. Mede o controle de atenção e impulsividade.
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.historyButton} 
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="stats-chart" size={20} color={colors.primary} />
          <Text style={styles.historyButtonText}>Visualizar Histórico Completo</Text>
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
    paddingTop: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingRight: 16,
    marginBottom: 12,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  cardContainer: {
    marginBottom: 16,
  },
  testCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  testTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  testDesc: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  historyButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
});
