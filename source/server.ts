import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";

import inventoryRouter from "./routes/inventoryRequests";
import userRouter from "./routes/userRequests";
import shoppingListRouter from "./routes/shoppingListsRequests";
import recipeRouter from "./routes/recipesRequests";
import weeklyMenuRouter from "./routes/weeklyMenuRequests";
import ocrRouter from "./routes/ocrRequests";
import { connectToDatabase } from "./services/dbConnection";
import { verifyAuthentication } from "./services/firebase";

const swaggerUi = require("swagger-ui-express"); //convert to import
const swaggerDoc = require("./docs/documentation");

const dotenv = require("dotenv");
dotenv.config();

const router: Express = express(); //initializes server

const PORT = process.env.PORT ?? 6060; //assigns port number to variable

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDoc));

async function isAuthorizedRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.sendStatus(401);
  } else if (authHeader) {
    let status = await verifyAuthentication(authHeader);

    if (!status) {
      return res.sendStatus(401);
    }
  }

  next();
}

router.use(isAuthorizedRequest);
//Defines what is used for what
router.use(morgan("dev")); //uses morgan to create logs
router.use(express.urlencoded({ extended: false })); //parsing of requests
router.use(express.json()); //takes care of json data

//RULES OF API
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //CORS-POLICY
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-WITH, Content-Type, Accept, Authorization"
  ); //CORS-HEADERS

  //CORS-METHOD-HEADERS
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
}); //RULES OF API

//Setting the routes
router.use("/user", userRouter.userRouter);
router.use("/inventory", inventoryRouter.inventoryRouter);
router.use("/shoppingList", shoppingListRouter.shoppingListRouter);
router.use("/recipe", recipeRouter.recipeRouter);
router.use("/weeklymenu", weeklyMenuRouter.weeklyMenuRouter);

router.use("/ocr", ocrRouter.ocrRouter);

router.use((req, res, next) => {
  //error handling
  const error = new Error("Not found");
  return res.status(404).json({
    message: error.message,
  });
}); //error handling

//MongoDB Connection
const userDatabase: string = "users"; //controls the database to use
const recipeDatabase: string = "recipes"; //controls the recipe database to use

connectToDatabase(userDatabase, recipeDatabase);

router.listen(PORT, () => {
  console.log("Server started. Listening at port: ", PORT);
});
