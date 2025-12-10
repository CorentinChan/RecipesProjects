import { create } from "zustand";

export const useStore = create((set) => ({
  // --- variables ---
  user: null,
  userRole : null,
  recipeID: null,

  // --- setters ---
  setUser: (user) => set({ user }),
  setUserRole: (userRole) => set({ userRole }),
  setRecipeID: (recipeID) => set({ recipeID }),

}));
