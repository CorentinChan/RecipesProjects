import "/src/App.css";

import { useState, useRef, useEffect } from "react";
import { KeywordContext } from "./keyword";

export default function SearchBar({ keyword, setKeyword, filter, setFilter }) {
  const [inputValue, setInputValue] = useState(keyword);

  const skipTimeout = useRef(false);

  function handleSubmit() {
    skipTimeout.current = true;
    setKeyword(inputValue);
  }

  //tempo 100ms to retape a letter
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!skipTimeout.current) {
        setKeyword(inputValue);
        skipTimeout.current = false;
      }
    }, 100);

    return () => clearTimeout(handler);
  }, [inputValue]);

  {
    /* set keyword into input*/
  }
  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  return (
    <section className="d-lg-flex recipeForm my-3 mx-lg-5 ">
      <div className="container mt-2  justify-content-between ">
        <div className="d-lg-flex ms-lg-3" role="search">
          <div className="input-group w-lg-50 slide-in-blurred-left rounded-5 border searchbar-group ">
            <span
              className="input-group-text btnSearch border-0 bg-transparent"
              id="basic-addon1 "
              onClick={handleSubmit}
            >
              <i className="fa-solid fa-magnifying-glass "></i>
            </span>

            <input
              type="text"
              className="form-control form-control-lg searchbar border-0 bg-transparent "
              placeholder="Search a recipe"
              id="textSearch"
              aria-label="Search"
              aria-describedby="basic-addon1"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
            />
          </div>
        </div>
      </div>

      {/* recipe filter*/}
      <div className="searchList mt-2">
        <select
          className="form-select fs-5 rounded-pill form-select-lg mx-2 me-lg-5 search-select "
          defaultValue={""}
          id="recipeFilter"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="" disabled>
            Sort by :{" "}
          </option>
          <option value="date">Sort by : date</option>
          <option value="recipeAlpha">Sort by : A to Z</option>
          <option value="note">Sort by : note </option>
        </select>
      </div>
    </section>
  );
}
