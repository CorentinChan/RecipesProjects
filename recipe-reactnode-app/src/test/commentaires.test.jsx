import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import axios from "axios";
import Commentaires from "../components/recipe/commentaires.jsx"; 
import "@testing-library/jest-dom";

//  Mock d'Axios
vi.mock("axios");

//  Mock de useNavigate 
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Composant Commentaires", () => {
  const mockRecipeID = "42";
  
  //  prepare les données du post axios
  const mockData = {
    comment: [
      {
        index: 1, 
        pseudo: "usertest",
        image: "test.jpg",
        note: 4,
        commentaire: "une recette au top",
        date: "28/06",
        userID: 7,
        mail: "test@mail.com",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("récupère et affiche les commentaires au chargement", async () => {
    // Mock de la réponse GET initiale
    axios.post.mockResolvedValueOnce({ data: mockData });

    render(
      <Commentaires
        recipeID={mockRecipeID}
        updateForm={false} 
        userRole="user"
      />
    );

    // Vérifie l'appel API initial
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/getComment"),
      { recipeID: mockRecipeID },
      expect.objectContaining({ withCredentials: true })
    );

    // Vérifie l'affichage
    expect(await screen.findByText("usertest")).toBeInTheDocument();
    expect(await screen.findByText("une recette au top")).toBeInTheDocument();
    
    // Vérifie l'affichage des étoiles (il doit y en avoir 4 pleines pour une note de 4)
    const stars = document.getElementsByClassName("fa-solid fa-star");
    expect(stars.length).toBe(4);
  });

  it("gère les erreurs API en console.error", async () => {
    // Spy sur la console 
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <Commentaires
        recipeID={mockRecipeID}
        udpateForm={false}
        userRole="user"
      />
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("error axios :"),
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });


});