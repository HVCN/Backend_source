import userController from "../controllers/user"; //new user
import express from "express";

const userRouter = express.Router(); //creates a shortcut

userRouter.post("/new/:uid", userController.newUser);
userRouter.delete("/delete/:uid", userController.deleteUser);

export default { userRouter };
