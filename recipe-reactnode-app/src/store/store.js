import { create } from "zustand";

export const useStore = create((set) => ({
  // --- variables ---
  user: null,
  userRole : null,
  recipeID: null,

  // --- setters ---
  setUser: (user) => set({ user }),
  setUserRole: (user) => set({ user }),
  setRecipeID: (recipeID) => set({ recipeID }),

}));
