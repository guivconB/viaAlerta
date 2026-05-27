import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { notificationsService } from '../../services/notifications';

export const ProfileScreen = () => {
  const { signOut, userName } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Alterar Senha',
      'Essa funcionalidade estará disponível em breve na próxima versão do app.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Meu Perfil</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {userName || 'Motorista'}
          </Text>
        </View>

        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons name="moon-outline" size={24} color={colors.textPrimary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Modo Escuro</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.textMuted, true: colors.primary }}
              thumbColor={'#FFF'}
            />
          </View>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.card, marginTop: 16 }]}>
          <TouchableOpacity style={styles.settingRow} onPress={handleChangePassword}>
            <View style={styles.settingIcon}>
              <Ionicons name="lock-closed-outline" size={24} color={colors.textPrimary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Alterar Senha</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>
        
        <Card style={[styles.card, { backgroundColor: colors.card, marginTop: 16 }]}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={async () => {
              const granted = await notificationsService.requestPermissions();
              if (granted) {
                await notificationsService.scheduleDailyReminders();
                Alert.alert('Lembretes Ativados ✅', 'Você receberá lembretes diários às 07h00 e 18h00.');
              } else {
                Alert.alert('Permissão Necessária', 'Você precisa permitir as notificações nas configurações do celular.');
              }
            }}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Ativar Lembretes Diários</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        <View style={styles.logoutContainer}>
          <Button title="Sair da Conta" onPress={handleLogout} variant="outline" />
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutContainer: {
    marginTop: 32,
  }
});
