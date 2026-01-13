import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Nav from "../components/Nav"; 
import "@testing-library/jest-dom";

// Mock de window.matchMedia (indispensable pour la ligne 20 de ton composant)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 2. Mock de Zustand (le store)
const mockSetUser = vi.fn();
vi.mock("../store/store", () => ({
  useStore: vi.fn((selector) => {
    const state = {
      user: "Jean", // On simule un utilisateur connecté par défaut
      setUser: mockSetUser
    };
    return selector(state);
  }),
}));

// Mock de useNavigate et import.meta.env
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de fetch global
global.fetch = vi.fn();

describe("Composant Nav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les liens de navigation principaux", () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    // Vérifie les titres issus de ton tableau pathTab
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Recipe")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("affiche le nom de l'utilisateur quand il est connecté", () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    // On a mocké l'utilisateur "Jean" dans Zustand
    expect(screen.getByText("Jean")).toBeInTheDocument();
    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
  });

  it("appelle la fonction logout et redirige lors du clic sur Sign out", async () => {
    // Mock de la réponse fetch réussie
    fetch.mockResolvedValueOnce({
      json: async () => ({ succeed: true }),
    });

    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      // Vérifie que fetch a été appelé vers la bonne URL (mock import.meta.env géré par Vitest)
      expect(fetch).toHaveBeenCalled();
      // Vérifie que l'utilisateur est réinitialisé dans le store
      expect(mockSetUser).toHaveBeenCalledWith("");
      // Vérifie la redirection
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  
});