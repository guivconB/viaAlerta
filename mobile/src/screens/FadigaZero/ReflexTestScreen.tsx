import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Vibration } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

type RootStackParamList = {
  Home: undefined;
  FadigaZero: undefined;
  History: undefined;
};

type ReflexTestScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FadigaZero'>;

interface Props {
  navigation: ReflexTestScreenNavigationProp;
}

type GameState = 'idle' | 'waiting' | 'active' | 'finished' | 'too_early';

export const ReflexTestScreen: React.FC<Props> = ({ navigation }) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    
    // Random delay between 2 and 5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('active');
      startTimeRef.current = Date.now();
      Vibration.vibrate(200); // Strong alert vibration when it turns green!
    }, delay);
  };

  const handleTap = () => {
    if (gameState === 'waiting') {
      // Tapped too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      Vibration.vibrate([0, 150]); // Error vibration pattern
      setGameState('too_early');
    } else if (gameState === 'active') {
      // Successful tap
      const timeElapsed = Date.now() - startTimeRef.current;
      Vibration.vibrate(50); // Fast success tap vibration
      setReactionTime(timeElapsed);
      setGameState('finished');
    }
  };

  const getStatus = (time: number) => {
    if (time < 300) return { text: 'EXCELENTE', color: colors.success };
    if (time < 500) return { text: 'BOM', color: colors.primary };
    if (time < 800) return { text: 'ALERTA', color: colors.warning };
    return { text: 'PERIGO (FADIGA EXTREMA)', color: colors.danger };
  };

  const renderContent = () => {
    switch (gameState) {
      case 'idle':
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.title}>Teste de Reflexos</Text>
            <Text style={styles.instructions}>
              Quando iniciar, a tela ficará vermelha. Assim que ela mudar para VERDE, toque na tela o mais rápido possível!
            </Text>
            <Button title="Começar Teste" onPress={startGame} />
            <Button 
              title="Ver Histórico" 
              variant="outline" 
              onPress={() => navigation.navigate('History')} 
            />
          </View>
        );
      
      case 'waiting':
        return (
          <TouchableOpacity style={[styles.gameArea, { backgroundColor: colors.danger }]} activeOpacity={1} onPress={handleTap}>
            <Text style={styles.gameText}>Aguarde o verde...</Text>
          </TouchableOpacity>
        );

      case 'active':
        return (
          <TouchableOpacity style={[styles.gameArea, { backgroundColor: colors.success }]} activeOpacity={1} onPress={handleTap}>
            <Text style={styles.gameText}>TOQUE AGORA!</Text>
          </TouchableOpacity>
        );

      case 'too_early':
        return (
          <View style={styles.centerContainer}>
            <Text style={[styles.title, { color: colors.warning }]}>Cedo Demais!</Text>
            <Text style={styles.instructions}>Você tocou antes da tela ficar verde.</Text>
            <Button title="Tentar Novamente" onPress={startGame} />
            <Button title="Voltar" variant="outline" onPress={() => setGameState('idle')} />
          </View>
        );

      case 'finished':
        if (!reactionTime) return null;
        const status = getStatus(reactionTime);
        return (
          <View style={styles.centerContainer}>
            <Card style={styles.resultCard}>
              <Text style={styles.resultLabel}>Seu tempo de reação:</Text>
              <Text style={styles.resultTime}>{reactionTime} ms</Text>
              
              <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                <Text style={styles.statusText}>{status.text}</Text>
              </View>
            </Card>

            <View style={styles.actionButtons}>
              <Button title="Fazer outro teste" onPress={startGame} />
              <Button title="Voltar ao Início" variant="outline" onPress={() => navigation.navigate('Home')} />
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  resultCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 32,
  },
  resultLabel: {
    color: colors.textMuted,
    fontSize: 16,
    marginBottom: 8,
  },
  resultTime: {
    color: colors.textPrimary,
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButtons: {
    width: '100%',
  }
});
