import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { Card } from '../../components/Card';

type RootStackParamList = {
  FadigaZero: undefined;
  History: undefined;
};

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

// Mock data for initial frontend
const mockHistory = [
  { id: '1', date: 'Hoje, 08:30', timeMs: 250, status: 'EXCELENTE', color: colors.success },
  { id: '2', date: 'Ontem, 18:45', timeMs: 420, status: 'BOM', color: colors.primary },
  { id: '3', date: 'Segunda, 07:15', timeMs: 850, status: 'PERIGO', color: colors.danger },
  { id: '4', date: 'Domingo, 10:00', timeMs: 290, status: 'EXCELENTE', color: colors.success },
];

export const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  
  const renderItem = ({ item }: { item: typeof mockHistory[0] }) => (
    <Card style={styles.historyCard}>
      <View style={styles.leftContent}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.timeText}>{item.timeMs} ms</Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Testes</Text>
      </View>

      <FlatList
        data={mockHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 24,
    paddingTop: 8,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  }
});
