import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Card({
  title,
  img,
  id,
  bnItem,
  note,
  author,
  isFavoris,
}) {
  const [favoris, setFavoris] = useState(isFavoris);
  let url = "/recipe?id=" + id;
  let navigate = useNavigate();
  const user = useStore((state) => state.user);

  img = img + "/preview";

  // axios request to add to favorite list
  async function fetchAddList() {
    let recipeID = id;
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/addList",
        {
          recipeID,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      //to change heart icon
      if (data.message === "List Added") setFavoris(true);
    } catch (error) {
      console.error("error axios :", error);
    }
  }

  //delete recipe from favorite list
  async function deleteFromList() {
    //let recipeID = e.target.value;
    let type = "favoris";
    let recipeID = id;

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/deleteRecipeList",
        {
          recipeID,
          type,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      //to change heart icon status
      if (data.check) {
        setFavoris(false);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  }

  // add recipe to list when click on button
  async function addFav(e) {
    e.stopPropagation();
    console.log(favoris);
    //setFavoris(!favoris);
    if (!favoris) fetchAddList();
    else deleteFromList();
  }

  return (
    //card
    <div
      className={`col-6 px-1 my-lg-3 ${nbItems === 3 ? "col-lg-4" : "col-lg-6"}`}
      key={id}
      data-testid={`card-${id}`}
      onClick={() => {
        navigate(url);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <div className="card shadow-sm h-100  border-0 rounded-4  " key={id}>
        <div className="imagePart rounded-4 ">
          {/*image*/}
          <img
            loading="lazy"
            width="400"
            height="240"
            decoding="async"
            src={
              img
                ? img
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwAdnj607fkyztZ3TkKVTdEy-FG-tD-gEGJQ&s"
            }
            className="card-img-top border-0 rounded-4 w-100"
            alt="Card"
          />
          {user && (
            <span className="heart-icon">
              {/*list button*/}
              <i
                className={`${
                  favoris ? "fa-solid" : "fa-regular"
                } fa-heart fs-1`}
                onClick={addFav}
              ></i>
            </span>
          )}
        </div>
        {/*description*/}
        <div className="card-body">
          <h5 className="card-title fw-bold"> {title} </h5>
          <div className="d-flex pt-2 justify-content-between">
            <span className="noteCard">
              {note}
              <i className="pb-1  ms-1 fa-solid fa-star"></i>
            </span>
            <span className="card-text fst-italic text-break">{author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
