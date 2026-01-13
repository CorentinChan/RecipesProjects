import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from 'react';
import SearchBar from "../components/searchBar.jsx"; 
import "@testing-library/jest-dom";


// Déclare les variables envoyé au composants
describe("Composant SearchBar", () => {
  const mockSetKeyword = vi.fn();
  const mockSetFilter = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers(); // active les faux timers pour le debounce
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers(); // revient aux timers réels après chaque test
  });

  //affiche la page
  it("affiche la valeur initiale du mot-clé", () => {
    render(
      <SearchBar 
        keyword="Pizza" 
        setKeyword={mockSetKeyword} 
        filter="" 
        setFilter={mockSetFilter} 
      />
    );
    
    const input = screen.getByPlaceholderText("Search a recipe");
    expect(input.value).toBe("Pizza"); // Vérifie la valeur de l'input barre de recheche
  });

  it("met à jour le mot-clé automatiquement après un délai (debounce)", () => {
    render(
      <SearchBar 
        keyword="" 
        setKeyword={mockSetKeyword} 
        filter="" 
        setFilter={mockSetFilter} 
      />
    );

    const input = screen.getByPlaceholderText("Search a recipe");
    
    // On simule la saisie de "Pasta"
    fireEvent.change(input, { target: { value: 'Pasta' } });

    // setKeyword ne doit pas encore avoir été appelé avant 100ms
    expect(mockSetKeyword).not.toHaveBeenCalled();

    // On avance le temps de 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockSetKeyword).toHaveBeenCalledWith("Pasta");
  });

  it("appelle setKeyword immédiatement lors du clic sur l'icône loupe (handleSubmit)", () => {
    render(
      <SearchBar 
        keyword="" 
        setKeyword={mockSetKeyword} 
        filter="" 
        setFilter={mockSetFilter} 
      />
    );

    const input = screen.getByPlaceholderText("Search a recipe");
    fireEvent.change(input, { target: { value: 'Lasagne' } });

    // On clique sur le boutton search
    const searchIcon = screen.getByRole('search').querySelector('.btnSearch');
    fireEvent.click(searchIcon);

    // Doit être appelé immédiatement grâce à handleSubmit
    expect(mockSetKeyword).toHaveBeenCalledWith("Lasagne");
  });

  it("met à jour le filtre lors du changement dans le select", () => {
    render(
      <SearchBar 
        keyword="" 
        setKeyword={mockSetKeyword} 
        filter="" 
        setFilter={mockSetFilter} 
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'date' } });

    expect(mockSetFilter).toHaveBeenCalledWith("date");
  });
});