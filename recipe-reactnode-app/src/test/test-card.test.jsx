import { describe, it, expect, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import React from 'react';

import "@testing-library/jest-dom";
import Card from "../components/card.jsx";

global.React = React; 

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

it("affiche le titre, l'image et l'id", () => {
  render(<Card id="10" title="Hello World" img="test.jpg" />);

  // test title
  expect(screen.getByText("Hello World")).toBeInTheDocument();

  // Image (alt="Card 1" )
  const img = screen.getByAltText("Card");
  expect(img).toBeInTheDocument();
  expect(img.getAttribute("src")).toContain("test.jpg");

  // ID via testid
  expect(screen.getByTestId("card-10")).toBeInTheDocument();
});

it("navigate click", () => {
  render(<Card id="10" title="Hello World" img="test.jpg" />);

  const card = screen.getByTestId("card-10");
  card.click();

  expect(mockNavigate).toHaveBeenCalledWith("/recipe?id=10");
});