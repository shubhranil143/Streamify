import { create } from "zustand";

// Zustand store for client-only theme state (lightweight alternative to Context/Redux)
export const useThemeStore = create((set) => ({
  // Initialize from localStorage or fallback to default 'coffee' theme
  theme: localStorage.getItem("streamify-theme") || "coffee",
  setTheme: (theme) => {
    // Persist choice in browser storage across sessions
    localStorage.setItem("streamify-theme", theme);
    set({ theme });
  },
}));

