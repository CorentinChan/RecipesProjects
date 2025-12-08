import { create } from "zustand";

export const useStore = create((set) => ({
  // --- variables ---
  user: null,
  recipeID: 690,

  // --- setters ---
  setUser: (user) => set({ user }),
  setRecipeID: (recipeID) => set({ recipeID }),

}));
