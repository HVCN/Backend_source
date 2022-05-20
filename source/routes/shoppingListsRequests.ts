import express from "express"; //import express module
import shoppingListController from "../controllers/shoppingList"; //import the api logic

const shoppingListRouter = express.Router(); //creates a shortcut

shoppingListRouter.get("/:collection", shoppingListController.getShoppingLists);
shoppingListRouter.get(
  "/:collection/:id",
  shoppingListController.getShoppingList
);
shoppingListRouter.put(
  "/:collection",
  shoppingListController.addItemShoppingList
);
shoppingListRouter.post("/:collection", shoppingListController.addShoppingList);

shoppingListRouter.delete(
  "/:collection/list",
  shoppingListController.deleteShoppingList
);
shoppingListRouter.delete(
  "/:collection",
  shoppingListController.deleteItemShoppingList
);
shoppingListRouter.put(
  "/:collection/archiveList",
  shoppingListController.archiveShoppingList
);

export default { shoppingListRouter }; // exports the routes
