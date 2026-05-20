import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* We will add an actual image/logo later, for now just a placeholder container */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>viaAlerta</Text>
        </View>
        
        <Text style={styles.title}>Bem-vindo ao viaAlerta</Text>
        <Text style={styles.subtitle}>
          Sua ferramenta para viagens mais seguras. Teste sua prontidão e acompanhe as condições da via em tempo real.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Começar agora" 
          onPress={() => navigation.navigate('Login')} 
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  logoText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  }
});
