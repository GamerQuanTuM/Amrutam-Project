import { create } from "zustand";

interface LogoutState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}


export const useLogout = create<LogoutState>((set) => ({
    loading: false,
    setLoading: (loading) => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0";
        set({ loading })
    },

}))