 
import { render, screen } from "@testing-library/react";
import React from 'react';

import "@testing-library/jest-dom";
import Card from "/src/components/Card";

global.React = React; // this also works for other globally available libraries

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

test("affiche le titre, l'image et l'id", () => {
  render(<Card id="10" title="Hello World" img="test.jpg" />);

  // test title
  expect(screen.getByText("Hello World")).toBeInTheDocument();

  // Image (alt="Card 1" )
  const img = screen.getByAltText("Card 1");
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute("src", "test.jpg");

  // ID via testid
  expect(screen.getByTestId("card-10")).toBeInTheDocument();
});

test("navigate click", () => {
  render(<Card id="10" title="Hello World" img="test.jpg" />);

  const card = screen.getByTestId("card-10");
  card.click();

  expect(mockNavigate).toHaveBeenCalledWith("/recipe?id=10");


});