import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Vibration, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  FadigaZero: undefined;
  SequenceTest: undefined;
  History: undefined;
};

type SequenceTestNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SequenceTest'>;

interface Props {
  navigation: SequenceTestNavigationProp;
}

type TestState = 'idle' | 'showing' | 'player' | 'finished';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 64) / 2;

const BLOCKS = [
  { id: 0, colorName: 'Azul', baseColor: '#1E3A8A', activeColor: '#3B82F6' },
  { id: 1, colorName: 'Laranja', baseColor: '#7C2D12', activeColor: colors.primary },
  { id: 2, colorName: 'Verde', baseColor: '#064E3B', activeColor: colors.success },
  { id: 3, colorName: 'Vermelho', baseColor: '#7F1D1D', activeColor: colors.danger }
];

export const SequenceTestScreen: React.FC<Props> = ({ navigation }) => {
  const [testState, setTestState] = useState<TestState>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number>(0);

  const testStateRef = useRef<TestState>('idle');
  testStateRef.current = testState;

  const startTest = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerIndex(0);
    setTestState('showing');
  };

  // Run the sequence display when state is 'showing' and sequence changes
  useEffect(() => {
    if (testState !== 'showing' || sequence.length === 0) return;

    let index = 0;
    const playNext = () => {
      if (testStateRef.current !== 'showing') return;
      if (index >= sequence.length) {
        setPlayerIndex(0);
        setTestState('player');
        return;
      }

      const blockId = sequence[index];
      setActiveBlock(blockId);
      Vibration.vibrate(80);

      setTimeout(() => {
        setActiveBlock(null);
        index++;
        setTimeout(playNext, 400); // gap between flashes
      }, 500); // flash duration
    };

    const delayTimer = setTimeout(playNext, 800);
    return () => clearTimeout(delayTimer);
  }, [sequence, testState]);

  const handleBlockPress = (id: number) => {
    if (testState !== 'player') return;

    setActiveBlock(id);
    Vibration.vibrate(50);
    
    // Quick unflash
    setTimeout(() => {
      setActiveBlock(null);
    }, 200);

    const expectedId = sequence[playerIndex];

    if (id === expectedId) {
      // Correct tap
      if (playerIndex + 1 === sequence.length) {
        // Completed the whole sequence!
        const nextScore = sequence.length;
        if (nextScore > bestScore) {
          setBestScore(nextScore);
        }
        
        // Success haptic pulse
        Vibration.vibrate([0, 60, 60, 60]);

        // Add to sequence and show again
        setTimeout(() => {
          setSequence(prev => [...prev, Math.floor(Math.random() * 4)]);
          setTestState('showing');
        }, 800);
      } else {
        // Correct, move to next item in current sequence
        setPlayerIndex(prev => prev + 1);
      }
    } else {
      // Wrong tap!
      Vibration.vibrate([0, 200, 100, 200]); // Danger/error pattern
      setTestState('finished');
    }
  };

  const getEvaluation = (score: number) => {
    if (score >= 6) return { text: 'EXCELENTE', color: colors.success, desc: 'Sua memória de curto prazo e atenção estão perfeitas!' };
    if (score >= 4) return { text: 'BOM', color: colors.primary, desc: 'Você está bem para dirigir.' };
    if (score === 3) return { text: 'ALERTA', color: colors.warning, desc: 'Atenção. Você pode estar demonstrando sinais leves de cansaço.' };
    return { text: 'PERIGO DE FADIGA', color: colors.danger, desc: 'Fadiga extrema detectada. Recomendamos fortemente descansar antes de dirigir.' };
  };

  const renderContent = () => {
    if (testState === 'idle') {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="grid-outline" size={64} color={colors.primary} />
          </View>
          <Text style={styles.title}>Sequência de Memória</Text>
          <Text style={styles.instructions}>
            Os quatro blocos coloridos piscarão em uma ordem específica. Seu objetivo é memorizar a sequência e repeti-la exatamente da mesma forma. A sequência aumenta a cada acerto.
          </Text>
          <Button title="Iniciar Teste" onPress={startTest} />
        </View>
      );
    }

    if (testState === 'showing' || testState === 'player') {
      return (
        <View style={styles.gameContainer}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>Rodada atual: <Text style={styles.boldText}>{sequence.length}</Text></Text>
            <Text style={styles.scoreText}>Melhor: <Text style={styles.boldText}>{bestScore}</Text></Text>
          </View>
          
          <Text style={styles.statusPrompt}>
            {testState === 'showing' ? 'Observe a sequência...' : 'Sua vez de repetir!'}
          </Text>

          <View style={styles.gridContainer}>
            {BLOCKS.map(block => (
              <TouchableOpacity
                key={block.id}
                activeOpacity={0.8}
                disabled={testState !== 'player'}
                onPress={() => handleBlockPress(block.id)}
                style={[
                  styles.gridBlock,
                  {
                    backgroundColor: activeBlock === block.id ? block.activeColor : block.baseColor,
                    borderColor: activeBlock === block.id ? '#FFF' : 'transparent',
                    borderWidth: activeBlock === block.id ? 2 : 0,
                  }
                ]}
              />
            ))}
          </View>
        </View>
      );
    }

    if (testState === 'finished') {
      const score = sequence.length - 1;
      const evaluation = getEvaluation(score);

      return (
        <View style={styles.centerContainer}>
          <Card style={styles.resultCard}>
            <Text style={styles.resultLabel}>Sequência alcançada:</Text>
            <Text style={styles.resultScore}>{score} <Text style={styles.resultScoreSub}>blocos</Text></Text>
            
            <View style={[styles.statusBadge, { backgroundColor: evaluation.color }]}>
              <Text style={styles.statusText}>{evaluation.text}</Text>
            </View>
            
            <Text style={styles.evaluationDesc}>{evaluation.desc}</Text>
          </Card>

          <View style={styles.actionButtons}>
            <Button title="Tentar Novamente" onPress={startTest} />
            <Button title="Voltar ao Início" variant="outline" onPress={() => navigation.navigate('FadigaZero')} />
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {testState === 'idle' || testState === 'finished' ? (
          <TouchableOpacity onPress={() => navigation.navigate('FadigaZero')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setTestState('idle')} style={styles.backButton}>
            <Text style={styles.backButtonText}>✕ Sair</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Fadiga Zero</Text>
      </View>
      {renderContent()}
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
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  scoreText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  boldText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  statusPrompt: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  gridContainer: {
    width: GRID_SIZE * 2 + 16,
    height: GRID_SIZE * 2 + 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  gridBlock: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderRadius: 16,
  },
  resultCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  resultLabel: {
    color: colors.textMuted,
    fontSize: 16,
    marginBottom: 8,
  },
  resultScore: {
    color: colors.textPrimary,
    fontSize: 54,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultScoreSub: {
    fontSize: 20,
    fontWeight: 'normal',
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  evaluationDesc: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    width: '100%',
  },
});
