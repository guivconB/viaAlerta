import { colors } from '../theme/colors';

export interface Report {
  id: string;
  type: 'BURACO' | 'SEMAFORO_QUEBRADO' | 'ILUMINACAO_DEFICIENTE' | 'ACIDENTE' | 'OUTRO';
  desc: string;
  location: string;
  latitude: number;
  longitude: number;
  time: string;
  upvotes: number;
  resolvedVotes: number;
  votedByMe?: boolean;
  resolvedByMe?: boolean;
  imageUrl?: string;
}

// Initial mock reports with latitude/longitude
let reports: Report[] = [
  {
    id: '1',
    type: 'BURACO',
    desc: 'Buraco gigante na pista da direita, quebrando rodas de motos.',
    location: 'Av. Santos Dumont, Atalaia',
    latitude: -10.9788,
    longitude: -37.0494,
    time: 'Há 10 min',
    upvotes: 14,
    resolvedVotes: 1,
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    type: 'ACIDENTE',
    desc: 'Batida entre dois carros bloqueando o cruzamento principal.',
    location: 'Av. Beira Mar, Jardins',
    latitude: -10.9525,
    longitude: -37.0583,
    time: 'Há 25 min',
    upvotes: 28,
    resolvedVotes: 0,
  },
  {
    id: '3',
    type: 'ILUMINACAO_DEFICIENTE',
    desc: 'Poste apagado na rua inteira, deixando a travessia muito escura.',
    location: 'Rua Itabaiana, Centro',
    latitude: -10.9125,
    longitude: -37.0483,
    time: 'Há 2 horas',
    upvotes: 5,
    resolvedVotes: 2,
  },
  {
    id: '4',
    type: 'SEMAFORO_QUEBRADO',
    desc: 'Semáforo apagado ou piscando no amarelo intermitente.',
    location: 'Av. Hermes Fontes, Suíssa',
    latitude: -10.9292,
    longitude: -37.0650,
    time: 'Há 3 horas',
    upvotes: 9,
    resolvedVotes: 0,
  },
];

// Callbacks for subscribers
type Listener = (reports: Report[]) => void;
const listeners = new Set<Listener>();

export const reportsService = {
  getReports(): Report[] {
    return [...reports];
  },

  addReport(reportData: Omit<Report, 'id' | 'time' | 'upvotes' | 'resolvedVotes'>) {
    const newReport: Report = {
      ...reportData,
      id: String(reports.length + 1),
      time: 'Agora mesmo',
      upvotes: 0,
      resolvedVotes: 0,
    };
    reports = [newReport, ...reports];
    this.notify();
    return newReport;
  },

  upvote(id: string) {
    reports = reports.map(r => {
      if (r.id === id) {
        const increment = r.votedByMe ? -1 : 1;
        return {
          ...r,
          upvotes: r.upvotes + increment,
          votedByMe: !r.votedByMe,
        };
      }
      return r;
    });
    this.notify();
  },

  voteResolved(id: string) {
    reports = reports.map(r => {
      if (r.id === id) {
        const increment = r.resolvedByMe ? -1 : 1;
        return {
          ...r,
          resolvedVotes: r.resolvedVotes + increment,
          resolvedByMe: !r.resolvedByMe,
        };
      }
      return r;
    });
    this.notify();
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    // Initial call
    listener([...reports]);
    return () => {
      listeners.delete(listener);
    };
  },

  notify() {
    for (const listener of listeners) {
      listener([...reports]);
    }
  }
};
