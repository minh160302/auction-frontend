import { User } from '@/schema';
import AxiosInstance from '@/utils/axiosInstance';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    setUser: (email: string) => void;
    clearUser: () => void;
}

const fetchUserData = async (email: string): Promise<User | undefined> => {
    const res = await AxiosInstance.get(`/users?email=${email}`);
    const data = res.data;
    if (!data.error) {
        return data.data[0];
    }
}

export const useAuthStore = create<AuthState, [["zustand/persist", AuthState]]>(persist(
    (set) => ({
        user: null,  // Initial state: no user is logged in
        setUser: async (email) => {
            const user = await fetchUserData(email);
            set({ user });
        },
        clearUser: () => set({ user: null }),
    }),
    {
        name: 'auth-storage',  // Name of the storage item
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
));