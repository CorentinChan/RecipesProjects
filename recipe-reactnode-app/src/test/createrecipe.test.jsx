import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import CreateRecipe from "../components/account/createRecipe.jsx"; 
import "@testing-library/jest-dom";

// Mock d'Axios et de fetch global
vi.mock('axios');
global.fetch = vi.fn();

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Composant CreateRecipe", () => {
  const mockCategories = {
    category: [
      { id: "1", name: "Dessert" },
      { id: "2", name: "Main Course" }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock de l'appel initial pour les catégories
    fetch.mockResolvedValue({
      json: async () => mockCategories,
    });
  });

  it("charge et affiche les catégories au montage", async () => {
    render(
      <MemoryRouter>
        <CreateRecipe />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Dessert")).toBeInTheDocument();
      expect(screen.getByText("Main Course")).toBeInTheDocument();
    });
  });

  it("met à jour les champs de texte simples", () => {
    render(
      <MemoryRouter>
        <CreateRecipe />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText("enter title recipe");
    fireEvent.change(titleInput, { target: { value: 'Gâteau au chocolat' } });
    expect(titleInput.value).toBe('Gâteau au chocolat');
  });

  it("ajoute une étape supplémentaire lors du clic sur le bouton 'plus'", async () => {
    render(
      <MemoryRouter>
        <CreateRecipe />
      </MemoryRouter>
    );

    // Par défaut, il y a 3 étapes (Array(3).fill(null))
    const initialSteps = screen.getAllByPlaceholderText(/write step/i);
    expect(initialSteps).toHaveLength(3);

    const addStepBtn = screen.getByText("Add more steps");
    fireEvent.click(addStepBtn);

    const updatedSteps = screen.getAllByPlaceholderText(/write step/i);
    expect(updatedSteps).toHaveLength(4);
  });

  it("soumet le formulaire avec succès", async () => {
    axios.post.mockResolvedValueOnce({ 
      data: { succeed: true, message: "Recipe created!" } 
    });

    render(
      <MemoryRouter>
        <CreateRecipe />
      </MemoryRouter>
    );

    // Remplissage minimal
    fireEvent.change(screen.getByPlaceholderText("enter title recipe"), { target: { value: 'Test Recipe' } });
    
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      // On vérifie que navigate(0) a été appelé (rechargement de la page)
      expect(mockNavigate).toHaveBeenCalledWith(0);
    });
  });

  it("affiche un message d'erreur en cas d'échec de la requête Axios", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Error creating recipe" } }
    });

    render(
      <MemoryRouter>
        <CreateRecipe />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));


  });
});