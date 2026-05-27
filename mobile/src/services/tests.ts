import { api } from './api';

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

export const testsService = {
  async fetchHistory() {
    try {
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
      console.error('Failed to save test:', e);
      throw e;
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
