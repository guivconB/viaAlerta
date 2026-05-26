import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Vibration } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  FadigaZero: undefined;
  StroopTest: undefined;
  History: undefined;
};

type StroopTestNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StroopTest'>;

interface Props {
  navigation: StroopTestNavigationProp;
}

type TestState = 'idle' | 'playing' | 'finished';

const COLOR_OPTIONS = [
  { id: 'blue', label: 'AZUL', hex: '#3B82F6', iconColor: colors.primary },
  { id: 'orange', label: 'LARANJA', hex: colors.primary },
  { id: 'green', label: 'VERDE', hex: colors.success },
  { id: 'red', label: 'VERMELHO', hex: colors.danger }
];

export const StroopTestScreen: React.FC<Props> = ({ navigation }) => {
  const [testState, setTestState] = useState<TestState>('idle');
  const [round, setRound] = useState<number>(1);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wordText, setWordText] = useState<string>('');
  const [wordColor, setWordColor] = useState<typeof COLOR_OPTIONS[0]>(COLOR_OPTIONS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(3); // 3 seconds per round
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setRound(1);
    setCorrectAnswers(0);
    generateNextRound();
    setTestState('playing');
  };

  const generateNextRound = () => {
    // Pick a random word
    const textIdx = Math.floor(Math.random() * COLOR_OPTIONS.length);
    // Pick a random color (make sure they don't always align, though a random match is fine, usually mismatch is better)
    const colorIdx = Math.floor(Math.random() * COLOR_OPTIONS.length);
    
    setWordText(COLOR_OPTIONS[textIdx].label);
    setWordColor(COLOR_OPTIONS[colorIdx]);
    setTimeLeft(3); // Reset timer to 3 seconds
  };

  // Timer logic
  useEffect(() => {
    if (testState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleTimeout();
          return 3;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState, round]);

  const handleTimeout = () => {
    // Time's up - counts as incorrect
    Vibration.vibrate(200);
    goToNextRound(false);
  };

  const handleAnswer = (selectedColorId: string) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = selectedColorId === wordColor.id;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      Vibration.vibrate(50); // Small correct vibration
    } else {
      Vibration.vibrate([0, 150]); // Stronger wrong vibration
    }

    goToNextRound(isCorrect);
  };

  const goToNextRound = (wasCorrect: boolean) => {
    if (round < 10) {
      setRound(prev => prev + 1);
      generateNextRound();
    } else {
      setTestState('finished');
    }
  };

  const getEvaluation = (score: number) => {
    const pct = score * 10;
    if (pct >= 90) return { text: 'EXCELENTE', color: colors.success, desc: 'Foco e atenção perfeitos! Pronto para a estrada.' };
    if (pct >= 70) return { text: 'BOM', color: colors.primary, desc: 'Atenção boa. Pode seguir viagem com tranquilidade.' };
    if (pct >= 50) return { text: 'ALERTA', color: colors.warning, desc: 'Reflexos moderados. Pode ser cansaço acumulado. Faça uma pausa em breve.' };
    return { text: 'PERIGO DE FADIGA', color: colors.danger, desc: 'Atenção severamente prejudicada. É altamente perigoso dirigir agora!' };
  };

  const renderContent = () => {
    if (testState === 'idle') {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="git-compare-outline" size={64} color={colors.warning} />
          </View>
          <Text style={styles.title}>Teste de Stroop</Text>
          <Text style={styles.instructions}>
            Uma palavra colorida aparecerá na tela. Você deve selecionar a opção correspondente à <Text style={styles.boldText}>COR DA FONTE</Text> da palavra, ignorando o que está escrito.
            {'\n\n'}
            Você terá <Text style={styles.boldText}>3 segundos</Text> por palavra em um total de <Text style={styles.boldText}>10 rodadas</Text>. Seja rápido e preciso!
          </Text>
          <Button title="Iniciar Teste" onPress={startTest} />
        </View>
      );
    }

    if (testState === 'playing') {
      const progressWidth = `${(timeLeft / 3) * 100}%`;

      return (
        <View style={styles.gameContainer}>
          <View style={styles.topInfo}>
            <Text style={styles.roundText}>Rodada {round} / 10</Text>
            <Text style={styles.scoreLive}>Acertos: {correctAnswers}</Text>
          </View>

          {/* Progress bar timer */}
          <View style={styles.timerContainer}>
            <View style={[styles.timerBar, { width: progressWidth, backgroundColor: timeLeft < 1.0 ? colors.danger : colors.primary }]} />
          </View>

          <View style={styles.wordDisplay}>
            <Text style={[styles.stroopWord, { color: wordColor.hex }]}>
              {wordText}
            </Text>
          </View>

          <Text style={styles.prompt}>Qual é a COR da palavra acima?</Text>

          <View style={styles.optionsContainer}>
            {COLOR_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.colorButton, { borderColor: opt.hex }]}
                activeOpacity={0.7}
                onPress={() => handleAnswer(opt.id)}
              >
                <View style={[styles.colorIndicator, { backgroundColor: opt.hex }]} />
                <Text style={styles.colorButtonText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    if (testState === 'finished') {
      const evaluation = getEvaluation(correctAnswers);

      return (
        <View style={styles.centerContainer}>
          <Card style={styles.resultCard}>
            <Text style={styles.resultLabel}>Sua taxa de acerto:</Text>
            <Text style={styles.resultScore}>{correctAnswers * 10}%</Text>
            <Text style={styles.resultScoreSub}>{correctAnswers} de 10 corretas</Text>
            
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
  boldText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  topInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roundText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreLive: {
    color: colors.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    height: 6,
    backgroundColor: '#262626',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 48,
  },
  timerBar: {
    height: '100%',
    borderRadius: 3,
  },
  wordDisplay: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 24,
  },
  stroopWord: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
  },
  prompt: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  colorButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
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
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultScoreSub: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 20,
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
