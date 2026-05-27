import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { testsService, FatigueTestResult } from '../../services/tests';
import { useTheme } from '../../theme/ThemeContext';

type RootStackParamList = {
  FadigaZero: undefined;
  History: undefined;
};

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

export const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [history, setHistory] = useState<FatigueTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = testsService.subscribe((data) => {
      setHistory(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Prepare chart data for Reflex Tests (easiest to graph as timeMs)
  const chartData = useMemo(() => {
    const reflexTests = history
      .filter(t => t.type === 'REFLEX')
      .slice(0, 10) // last 10 tests
      .reverse(); // chronological for chart
    
    if (reflexTests.length < 2) return null;

    return {
      labels: reflexTests.map((_, i) => `#${i + 1}`),
      datasets: [
        {
          data: reflexTests.map(t => t.score), // time in ms
        }
      ]
    };
  }, [history]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELENTE': return colors.success;
      case 'BOM': return colors.primary;
      case 'ALERTA': return colors.warning;
      case 'PERIGO':
      case 'PERIGO DE FADIGA EXTREMA': return colors.danger;
      default: return colors.textMuted;
    }
  };

  const getTestLabel = (type: string) => {
    switch (type) {
      case 'REFLEX': return 'Reação Visual';
      case 'SEQUENCE': return 'Simon Says';
      case 'STROOP': return 'Teste Stroop';
      default: return type;
    }
  };

  const formatScore = (type: string, score: number) => {
    if (type === 'REFLEX') return `${score} ms`;
    if (type === 'SEQUENCE') return `${score} blocos`;
    if (type === 'STROOP') return `${score}% acertos`;
    return score.toString();
  };

  const renderItem = ({ item }: { item: FatigueTestResult }) => (
    <Card style={styles.historyCard}>
      <View style={styles.leftContent}>
        <Text style={styles.typeText}>{getTestLabel(item.type)}</Text>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleString('pt-BR')}</Text>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.timeText}>{formatScore(item.type, item.score)}</Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Testes</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            chartData ? (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Evolução de Reflexos (ms)</Text>
                <LineChart
                  data={chartData}
                  width={Dimensions.get('window').width - 48} // from react-native
                  height={220}
                  yAxisSuffix="ms"
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: '#1E1E1E',
                    backgroundGradientFrom: '#1E1E1E',
                    backgroundGradientTo: '#1E1E1E',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`, // colors.primary
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa726"
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                />
              </View>
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>Faça mais testes de Reflexo para ver seu gráfico de evolução.</Text>
              </View>
            )
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum teste realizado ainda.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  chartContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  chartTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'flex-start'
  },
  emptyChart: {
    padding: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  emptyChartText: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  typeText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  }
});
