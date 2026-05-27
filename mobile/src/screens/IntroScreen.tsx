import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Button } from '../components/Button';

type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  Register: undefined;
};

type IntroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

interface Props {
  navigation: IntroScreenNavigationProp;
}

export const IntroScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/ViaAlerta_Logo-01.png')} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
        
        <Text style={[styles.title, { color: colors.textPrimary }]}>Bem-vindo ao viaAlerta</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          A sua ferramenta definitiva para garantir uma viagem segura e sem imprevistos.
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="flash" size={24} color={colors.primary} />
            </View>
            <View style={styles.featureTexts}>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Fadiga Zero</Text>
              <Text style={[styles.featureDesc, { color: colors.textMuted }]}>
                Teste seus reflexos em 10 segundos antes de dar a partida.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.warning + '20' }]}>
              <Ionicons name="warning" size={24} color={colors.warning} />
            </View>
            <View style={styles.featureTexts}>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Mapeamento Vivo</Text>
              <Text style={[styles.featureDesc, { color: colors.textMuted }]}>
                Reporte e evite perigos na via com a ajuda de outros motoristas.
              </Text>
            </View>
          </View>
        </View>

      </View>

      <View style={styles.footer}>
        <Button 
          title="Começar a dirigir com segurança" 
          onPress={() => navigation.navigate('Login')} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTexts: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  }
});
