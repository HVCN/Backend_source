import express from "express"; //import express module
import recipeController from "../controllers/recipes"; //import the api logic

const recipeRouter = express.Router(); //creates a shortcut

recipeRouter.get("/recipes/:id", recipeController.getOneRecipe);
recipeRouter.get("/recipes", recipeController.getAllRecipes);
recipeRouter.get(
  "/ingredients/:ingredient",
  recipeController.searchIngredientInRecipes
);
recipeRouter.get("/search/:title", recipeController.searchForRecipe);

recipeRouter.get("/random", recipeController.getRandomRecipe);
recipeRouter.get(
  "/compare/:collection/:returnQuantity",
  recipeController.compareRecipeUser
);

export default { recipeRouter };
