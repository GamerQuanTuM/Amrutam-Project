import { create } from 'zustand';
import { type User } from "@/types/user"
import { axiosInstance } from '@/lib/axiosInstance';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SessionState {
  user: User | null;
  message: string;
  loading: boolean;
  error: string | null;
  fetchUser: (appointments?: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setMessage: (message: string) => void
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      message: '',
      fetchUser: async (appointments?: boolean) => {
        try {
          set({ loading: true, error: null });
          const response = await axiosInstance.get(`/auth/current-user?appointments=${appointments}`);
          set({ user: response.data.data as User, loading: false, error: null, message: response.data.message });
        } catch (error: any) {
          set({ loading: false, error: error.message || 'Failed to fetch user' });
          return null;
        }
      },
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setMessage: (message) => set({ message }),
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);