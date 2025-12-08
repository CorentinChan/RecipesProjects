import { createContext, useState } from "react";

export const KeywordContext = createContext();

export function KeywordProvider({ children }) {
  const [keyword, setKeyword] = useState(""); // variable globale

  return (
    <KeywordContext.Provider value={{ keyword, setKeyword }}>
      {children}
    </KeywordContext.Provider>
  );
}