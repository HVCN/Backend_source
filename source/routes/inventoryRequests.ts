import express from "express"; //import express module
import inventoryController from "../controllers/inventory"; //import the api logic

const inventoryRouter = express.Router(); //creates a shortcut

inventoryRouter.get("/:collection", inventoryController.getAllItems);
inventoryRouter.get(
  "/:collection/search/:itemName",
  inventoryController.searchItem
);
inventoryRouter.get(
  "/:collection/expiration/search",
  inventoryController.getExpiringItems
);
inventoryRouter.get("/:collection/:type", inventoryController.getAllItemsType);

inventoryRouter.get(
  "/:collection/:type/:location/:id",
  inventoryController.getSpecificItem
);

inventoryRouter.put("/:collection", inventoryController.updateItem);
inventoryRouter.delete("/:collection", inventoryController.deleteItem);
inventoryRouter.post("/:collection", inventoryController.addItem);

export default { inventoryRouter }; // exports the routes
