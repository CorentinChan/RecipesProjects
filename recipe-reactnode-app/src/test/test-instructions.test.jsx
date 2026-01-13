import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from "@testing-library/react";
import React from 'react';
import axios from 'axios';
import Instructions from "../components/recipe/instructions.jsx"; // Vérifie ton chemin
import "@testing-library/jest-dom";

//  Mock  d'Axios
vi.mock('axios');

describe("Composant Instructions", () => {
  const mockRecipeID = "42";
  
  // Données de test simulées ( à la place du backend))
  const mockData = {
    instructions: [
      { instruction: "Préchauffer le four à 180°C." },
      { instruction: "Mélanger la farine et les oeufs." },
      { instruction: "Cuire pendant 30 minutes." }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le titre de la section", () => {
    // On mock une réponse vide pour ce test 
    axios.post.mockResolvedValueOnce({ data: { instructions: [] } });
    
    render(<Instructions recipeID={mockRecipeID} />);
    
    expect(screen.getByText("How to make it")).toBeInTheDocument();
  });

  it("récupère et affiche les instructions depuis l'API au chargement", async () => {
    // On simule la réponse réussie d'Axios
    axios.post.mockResolvedValueOnce({ data: mockData });

    render(<Instructions recipeID={mockRecipeID} />);

    // On vérifie qu'Axios a été appelé avec les bons paramètres
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/getSteps"),
      { recipeID: mockRecipeID },
      expect.any(Object)
    );

    // On attend que React mette à jour le DOM après la réponse de axios
    // On utilise waitFor car l'affichage dépend d'un état (useState)
    await waitFor(() => {
      expect(screen.getByText(/Préchauffer le four/i)).toBeInTheDocument();
      expect(screen.getByText(/Mélanger la farine/i)).toBeInTheDocument();
      expect(screen.getByText(/Cuire pendant 30 minutes/i)).toBeInTheDocument();
    });

    // Vérifie que les numéros d'étapes sont bien rendus
    expect(screen.getByText("1.STEP")).toBeInTheDocument();
    expect(screen.getByText("3.STEP")).toBeInTheDocument();
  });

  it("affiche une erreur dans la console en cas d'échec de la requête", async () => {
    // On simule une erreur réseau
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    render(<Instructions recipeID={mockRecipeID} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("error axios :"), expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});