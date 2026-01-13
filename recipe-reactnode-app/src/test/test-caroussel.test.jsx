import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from "@testing-library/react";
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Carroussel from "../components/caroussel.jsx"; 
import "@testing-library/jest-dom";

//  Mock d'Axios
vi.mock('axios');

//  Mock de useNavigate (nécessaire car Card utilise probablement la navigation)
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams()],
  };
});

describe("Composant Carroussel", () => {
  // Génération de 15 recettes fictives pour tester le groupement par 12
  const mockRecipes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    title: `Recette ${i}`,
    image: `img${i}.jpg`,
    note: 4,
    auteur: "C.C",
    userID: i % 2 === 0 ? "user123" : null // Alterne les favoris
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("récupère les recettes et les affiche dans le carroussel", async () => {
    // Mock de la réponse backend
    axios.post.mockResolvedValueOnce({ data: { recipes: mockRecipes } });

    render(
      <MemoryRouter>
        <Carroussel keyword="chicken" filter="date" />
      </MemoryRouter>
    );

    // Vérifie que l'appel API a été fait avec les bons paramètres
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/searchRecipeHome"),
      expect.objectContaining({ textSearch: "chicken", searchFilter: "date" }),
      expect.any(Object)
    );

    // Attendre que les premières cartes s'affichent
    await waitFor(() => {
      expect(screen.getByText("Recette 0")).toBeInTheDocument();
      expect(screen.getByText("Recette 11")).toBeInTheDocument();
    });
  });

  it("doit grouper les recettes par 12 (créer plusieurs slides)", async () => {
    axios.post.mockResolvedValueOnce({ data: { recipes: mockRecipes } });

    render(
      <MemoryRouter>
        <Carroussel keyword="" filter="" />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Vérifie la présence des indicateurs de pagination (1 et 2)
      // Comme on a 15 recettes et qu'on groupe par 12, on doit avoir 2 slides
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.queryByText("3")).not.toBeInTheDocument();
    });

    // Vérifie que la première slide est active au début
    const firstSlide = screen.getByText("1").closest('button');
    expect(firstSlide).toHaveClass('active');
  });

  it("gère une liste de recettes vide sans planter", async () => {
    axios.post.mockResolvedValueOnce({ data: { recipes: [] } });

    render(
      <MemoryRouter>
        <Carroussel keyword="" filter="" />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Ne doit pas afficher de cartes mais le squelette du carroussel est là
      const carousel = document.querySelector('#cardCarousel');
      expect(carousel).toBeInTheDocument();
    });
  });
});