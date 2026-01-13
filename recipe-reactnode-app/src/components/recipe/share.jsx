import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import { WhatsappShareButton, WhatsappIcon } from "react-share";

// share recipe with id url when user click on logo using react-share
export default function Share({ recipeID, meal }) {
  const url = "https://corentinchan.de/recipe?id=" + recipeID;
  //const title = "Une fabuleuse recette à,découvrir!";
  return (
    meal && (
      <div className="shareRecipe pt-3 mt-3">
        <h3>Share recipes</h3>
        <div>
          <FacebookShareButton className="m-2" url={url} quote={meal?.title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton className="m-2" url={url} title={meal?.title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <WhatsappShareButton
            className="m-2"
            url={url}
            title={meal?.title}
            separator=":: "
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </div>
    )
  );
}
