import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

type RootStackParamList = {
  Home: undefined;
  ViaAlerta: undefined;
  CreateReport: undefined;
};

type FeedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ViaAlerta'>;

interface Props {
  navigation: FeedScreenNavigationProp;
}

// Mock data for the feed
const mockReports = [
  { id: '1', type: 'BURACO', desc: 'Buraco gigante na pista direita', location: 'Av. Rio de Janeiro', time: 'Há 10 min' },
  { id: '2', type: 'ACIDENTE', desc: 'Batida entre dois carros bloqueando cruzamento', location: 'Centro', time: 'Há 25 min' },
  { id: '3', type: 'ILUMINACAO_DEFICIENTE', desc: 'Poste apagado na rua toda', location: 'Orla', time: 'Há 2 horas' },
  { id: '4', type: 'SEMAFORO_QUEBRADO', desc: 'Semáforo piscando no amarelo', location: 'Luzia', time: 'Há 3 horas' },
];

export const FeedScreen: React.FC<Props> = ({ navigation }) => {

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ACIDENTE': return colors.danger;
      case 'BURACO': return colors.warning;
      case 'SEMAFORO_QUEBRADO': return colors.primary;
      default: return colors.textMuted;
    }
  };

  const renderReport = ({ item }: { item: typeof mockReports[0] }) => (
    <Card style={styles.reportCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
          <Text style={styles.typeText}>{item.type.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <Text style={styles.descText}>{item.desc}</Text>
      <Text style={styles.locationText}>📍 {item.location}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Início</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Feed Via Alerta</Text>
      </View>

      <FlatList
        data={mockReports}
        keyExtractor={item => item.id}
        renderItem={renderReport}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fabContainer}>
        <Button 
          title="+ Nova Denúncia" 
          onPress={() => navigation.navigate('CreateReport')} 
        />
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  backButton: {
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
  },
  listContainer: {
    padding: 24,
    paddingBottom: 100, // Space for the FAB
  },
  reportCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  descText: {
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  }
});
