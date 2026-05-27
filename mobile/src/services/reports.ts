import { api } from './api';

export interface Report {
  id: string;
  type: string;
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

let reports: Report[] = [];

type Listener = (reports: Report[]) => void;
const listeners = new Set<Listener>();

export const reportsService = {
  async fetchReports() {
    try {
      const response = await api.get('/posts');
      reports = response.data.feed;
      this.notify();
    } catch (e) {
      console.error('Failed to fetch reports:', e);
    }
  },

  getReports(): Report[] {
    return [...reports];
  },

  async addReport(reportData: Omit<Report, 'id' | 'time' | 'upvotes' | 'resolvedVotes'>) {
    try {
      await api.post('/posts', {
        content: reportData.desc,
        problemType: reportData.type,
        location: reportData.location,
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        imageUrl: reportData.imageUrl
      });
      await this.fetchReports(); // reload
    } catch (e) {
      console.error('Failed to create report:', e);
      throw e;
    }
  },

  async upvote(id: string) {
    try {
      // Optimistic update
      reports = reports.map(r => {
        if (r.id === id) {
          const increment = r.votedByMe ? -1 : 1;
          return { ...r, upvotes: r.upvotes + increment, votedByMe: !r.votedByMe };
        }
        return r;
      });
      this.notify();
      
      await api.post(`/posts/${id}/upvote`);
      await this.fetchReports(); // ensure sync with backend
    } catch (e) {
      console.error('Failed to upvote:', e);
      await this.fetchReports(); // revert on fail
    }
  },

  async voteResolved(id: string) {
    try {
      // Optimistic update
      reports = reports.map(r => {
        if (r.id === id) {
          const increment = r.resolvedByMe ? -1 : 1;
          return { ...r, resolvedVotes: r.resolvedVotes + increment, resolvedByMe: !r.resolvedByMe };
        }
        return r;
      });
      this.notify();
      
      await api.post(`/posts/${id}/resolve`);
      await this.fetchReports(); // ensure sync with backend
    } catch (e) {
      console.error('Failed to resolve vote:', e);
      await this.fetchReports(); // revert on fail
    }
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    this.fetchReports();
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
