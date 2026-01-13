import Ingredients from "../components/recipe/ingredients.jsx";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";

// Mock Axios
vi.mock("axios");

//déclare le json ingredients
describe("Composant Ingredients", () => {
  const mockRecipeID = "42";

  const mockData = {
    ingredients: [
      { ingredient: "pommes", measure: "2" },
      { ingredient: "oeufs", measure: "3" },
      { ingredient: "farine", measure: "200g" },
    ],
  };

  //reset mocks
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //post axios
  it("affiche le titre de la section", async () => {
    axios.post.mockResolvedValueOnce({ data: { ingredients: [] } });
    
    render(<Ingredients recipeID={mockRecipeID} />);

    //check si le titre ingredient est présent
    expect(
      screen.getByText(/ingredients/i)
    ).toBeInTheDocument();
  });

  it("récupère et affiche les ingrédients depuis l'API", async () => {
    axios.post.mockResolvedValueOnce({ data: mockData });

    render(<Ingredients recipeID={mockRecipeID} />);

    //vérifie la request effectué
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/getIngredients"),
      { recipeID: mockRecipeID },
      expect.any(Object)
    );

    //vérifie que les données récupérées sont bien affichés
    expect(await screen.findByText("2 of pommes")).toBeInTheDocument();
    expect(await screen.findByText("3 of oeufs")).toBeInTheDocument();
    expect(await screen.findByText("200g of farine")).toBeInTheDocument();
  });

  //vérifie la gestion d'erreur
  it("log une erreur si l'appel API échoue", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {}); // vi.spyon simule la fonction console.log
    axios.post.mockRejectedValueOnce(new Error("Network Error"));// simule l'echec de axios avec l'erreur 'network error'

    render(<Ingredients recipeID={mockRecipeID} />);//affiche la page

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled(); // la fonction console doit etre appelé
    });

    consoleSpy.mockRestore(); // remet un comportement de console habituel
  });
});
