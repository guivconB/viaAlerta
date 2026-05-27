import { api } from './api';
import * as SecureStore from 'expo-secure-store';

export interface FatigueTestResult {
  id: string;
  type: 'REFLEX' | 'SEQUENCE' | 'STROOP';
  score: number;
  status: 'EXCELENTE' | 'BOM' | 'ALERTA' | 'PERIGO' | 'PERIGO DE FADIGA EXTREMA';
  date: string;
}

let testHistory: FatigueTestResult[] = [];

type Listener = (history: FatigueTestResult[]) => void;
const listeners = new Set<Listener>();

const OFFLINE_TESTS_KEY = 'viaAlerta_offline_tests';

export const testsService = {
  async syncOfflineTests() {
    try {
      const offlineData = await SecureStore.getItemAsync(OFFLINE_TESTS_KEY);
      if (offlineData) {
        const tests = JSON.parse(offlineData) as Omit<FatigueTestResult, 'id' | 'date'>[];
        if (tests.length > 0) {
          // Push sequentially or concurrently
          for (const test of tests) {
            await api.post('/tests', {
              testType: test.type,
              score: test.score,
              status: test.status,
            });
          }
          await SecureStore.deleteItemAsync(OFFLINE_TESTS_KEY);
          console.log(`Sincronizados ${tests.length} testes offline!`);
        }
      }
    } catch (e) {
      console.error('Falha ao sincronizar testes offline:', e);
    }
  },

  async fetchHistory() {
    try {
      await this.syncOfflineTests(); // Attempt to sync before fetching
      const response = await api.get('/tests');
      testHistory = response.data.history;
      this.notify();
    } catch (e) {
      console.error('Failed to fetch test history:', e);
    }
  },

  getHistory(): FatigueTestResult[] {
    return [...testHistory];
  },

  async addTest(testData: Omit<FatigueTestResult, 'id' | 'date'>) {
    try {
      await api.post('/tests', {
        testType: testData.type,
        score: testData.score,
        status: testData.status,
      });
      await this.fetchHistory(); // sync
    } catch (e) {
      console.error('Modo Offline: Teste falhou na API. Salvando localmente...', e);
      // Salvar offline
      try {
        const existing = await SecureStore.getItemAsync(OFFLINE_TESTS_KEY);
        const tests = existing ? JSON.parse(existing) : [];
        tests.push(testData);
        await SecureStore.setItemAsync(OFFLINE_TESTS_KEY, JSON.stringify(tests));
        
        // Adicionar artificialmente ao historico local para refletir na UI imediatamente
        testHistory = [{ ...testData, id: 'offline-' + Date.now(), date: new Date().toISOString() }, ...testHistory];
        this.notify();
      } catch (err) {
        console.error('Erro critico ao salvar offline', err);
      }
    }
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    this.fetchHistory();
    return () => {
      listeners.delete(listener);
    };
  },

  notify() {
    for (const listener of listeners) {
      listener([...testHistory]);
    }
  }
};
