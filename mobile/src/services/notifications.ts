import { Platform, Alert } from 'react-native';

// Mock service for MVP (Expo Go SDK 53+ dropped native push support without EAS Custom Dev Client)
export const notificationsService = {
  async requestPermissions() {
    // Para MVP via Expo Go, pulamos a permissão real e fingimos que foi dada.
    return true;
  },

  async scheduleDailyReminders() {
    // Num app final, usaríamos EAS Build + Notificações Nativas.
    // Para a feira/MVP no Expo Go, apenas fingimos o agendamento no console.
    console.log('Notificações diárias agendadas virtualmente (Mock para SDK 53+).');
    
    // Se o usuário clicar "Ativar", a ProfileScreen mostrará o alert() de sucesso.
    return true;
  }
};
