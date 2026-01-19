
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Decription from "../components/recipe/description.jsx"; 

// MOCK DU Store
// On simule le store pour qu'il réponde aux appels : useStore((state) => state.user)
vi.mock("/src/store/store.js", () => ({
  useStore: vi.fn((selector) => selector({ user: { id: 1, name: "Jean" } })),
}));

// Import du store après le mock pour pouvoir manipuler sa valeur si besoin
import { useStore } from "/src/store/store.js";

// MOCKS axios
vi.mock("axios");
vi.mock("/src/components/recipe/descriptionAdmin.jsx", () => ({
  default: () => <div data-testid="admin-panel">Admin Panel</div>,
}));

// Mock global pour éviter l'erreur scrollTo et print
window.print = vi.fn();
window.scrollTo = vi.fn();

describe("Composant Decription", () => {
  const mockSetMeal = vi.fn();
  const mockRecipeID = "123";

  // Données de test
  const mockRecipeData = {
    recipe: [
      {
        title: "Pâtes Carbonara",
        image: "carbonara.jpg",
        note: 4.5,
        description: "Une super recette",
        activeTime: "15 min",
        totalTime: "25 min",
        yield: "2",
        auteur: "Chef Mario",
      },
    ],
    nbNotes: 10,
    nbRecipes: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Par défaut, on simule un utilisateur connecté
    useStore.mockImplementation((selector) => selector({ user: { name: "Jean" } }));
  });

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <Decription
          recipeID={mockRecipeID}
          userRole={props.userRole || "user"}
          updateForm={false}
          meal={props.meal || mockRecipeData.recipe[0]}
          setMeal={mockSetMeal}
        />
      </BrowserRouter>
    );
  };

  it("affiche les détails de la recette après l'appel API", async () => {
    axios.post.mockResolvedValueOnce({ data: mockRecipeData });

    renderComponent();

    // findByText attend automatiquement que l'élément apparaisse avec axait
    const title = await screen.findByText("Pâtes Carbonara");
    expect(title).toBeInTheDocument();
    expect(screen.getByText("Chef Mario")).toBeInTheDocument();
    expect(screen.getByText("15 min")).toBeInTheDocument();
  });

  
  it("appelle addList et change la couleur du message en vert", async () => {
    axios.post
      .mockResolvedValueOnce({ data: mockRecipeData }) // pour fetchDescription
      .mockResolvedValueOnce({ data: { message: "List Added" } }); // pour addList

    renderComponent();

    // Attendre que l'icône plus soit là (fa-plus)
    const addButton = await waitFor(() => document.querySelector(".fa-plus"));
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    // On vérifie que le message s'affiche en vert
    const message = await screen.findByText("List Added");
    expect(message).toBeInTheDocument();
    expect(message.style.color).toBe("green");
  });

  it("affiche le panneau Admin uniquement si le rôle est admin", async () => {
    axios.post.mockResolvedValueOnce({ data: mockRecipeData });

    const { rerender } = renderComponent({ userRole: "admin" });
    expect(await screen.findByTestId("admin-panel")).toBeInTheDocument();

    // On change en utilisateur standard
    rerender(
      <BrowserRouter>
        <Decription
          recipeID={mockRecipeID}
          userRole="user"
          meal={mockRecipeData.recipe[0]}
          setMeal={mockSetMeal}
        />
      </BrowserRouter>
    );
    expect(screen.queryByTestId("admin-panel")).not.toBeInTheDocument();
  });

  it("lance l'impression lors du clic sur l'icône print", async () => {
    axios.post.mockResolvedValueOnce({ data: mockRecipeData });
    renderComponent();

    const printIcon = await waitFor(() => document.getElementById("print"));
    fireEvent.click(printIcon); // click sur l'icine dont l'ID est print

    //verifie sin la fonction print a été appelée
    expect(window.print).toHaveBeenCalled();
  });
});