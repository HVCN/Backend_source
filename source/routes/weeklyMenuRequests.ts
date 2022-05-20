import express from "express";
import weeklyMenuController from "../controllers/weeklyMenu";
import generateController from "../controllers/generate";

const weeklyMenuRouter = express.Router();

weeklyMenuRouter.get("/:collection", weeklyMenuController.getWeeklyMenu);
weeklyMenuRouter.get(
  "/:collection/generate",
  generateController.generateWeeklyMenu
);
weeklyMenuRouter.put("/:collection", weeklyMenuController.updateWeeklyMenu);
weeklyMenuRouter.delete("/:collection", weeklyMenuController.deleteMenuDay);

export default { weeklyMenuRouter };
