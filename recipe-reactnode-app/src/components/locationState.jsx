import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function LocationState({
  user,
  userRole,
  setUser,
  setUserRole,
}) {
  const location = useLocation();

  useEffect(() => {
    async function getPseudo() {
      //when path change , check cookies for authentification
      console.log("API" + import.meta.env.VITE_API_URL);
      try {
        const { data } = await axios.get(
          import.meta.env.VITE_API_URL + "/getPseudo",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, //
          },
        );

        console.log("Réponse backend app :", data);

        setUser(data.pseudo);
        setUserRole(data.role);
        console.log("getpseudo and role");
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
      }
    }
    getPseudo();
  }, [location.pathname]);

  return <></>;
}
