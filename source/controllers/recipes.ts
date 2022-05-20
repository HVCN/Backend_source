//Import needed packages from modules
import { Request, Response } from "express";
import { getRecipeDb, getUserDb } from "../services/dbConnection";
import { ObjectId } from "bson";

import {
  RECIPE_COLLECTION,
  MAX_RETURN_QUANTITY,
  UID_FORMAT,
  NEEDED_INGREDIENTS,
} from "../constants/index";

import { RecipeObject, RecipeCompareObject, UserObject } from "../types/index";

//below are the logic for the API, meaning what the API does or called controllers
//logic for getting all posts
const getAllRecipes = async (req: Request, res: Response) => {
  const dbConn = await getRecipeDb();

  const aggDoc = [
    {
      $sort: {
        title: 1,
      },
    },
  ];

  try {
    dbConn
      .collection(RECIPE_COLLECTION)
      .aggregate(aggDoc)
      .toArray((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(result);
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
}; //getAllRecipes

const getOneRecipe = async (req: Request, res: Response) => {
  const dbConn = await getRecipeDb();
  let id = req.params.id;

  try {
    dbConn
      .collection(RECIPE_COLLECTION)
      .find({ _id: new ObjectId(id) })
      .toArray((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(result);
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

const searchIngredientInRecipes = async (req: Request, res: Response) => {
  const dbConn = await getRecipeDb();
  let ingredient = req.params.ingredient;

  const aggDoc = [
    {
      $match: {
        ingredients: {
          $regex: ingredient,
          $options: "i, x",
        },
      },
    },
    {
      $sort: {
        title: 1,
      },
    },
  ];

  try {
    dbConn
      .collection(RECIPE_COLLECTION)
      .aggregate(aggDoc)
      .toArray((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(result);
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

const searchForRecipe = async (req: Request, res: Response) => {
  const dbConn = await getRecipeDb();

  let title: string = req.params.title;

  const aggDoc = [
    {
      $match: {
        title: {
          $regex: title,
          $options: "i, x",
        },
      },
    },
    {
      $project: {
        _id: "$_id",
        title: "$title",
        category: "$category",
        uri: "$uri",
      },
    },
    {
      $sort: {
        itemName: 1,
      },
    },
  ];
  try {
    dbConn
      .collection(RECIPE_COLLECTION)
      .aggregate(aggDoc)
      .toArray((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(result);
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getRandomRecipe = async (req: Request, res: Response) => {
  const dbConn = await getRecipeDb();
  const aggDoc = [
    {
      $sort: {
        title: 1,
      },
    },
  ];

  let resultRecipe: RecipeObject[];
  try {
    dbConn
      .collection(RECIPE_COLLECTION)
      .aggregate(aggDoc)
      .toArray((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          resultRecipe = JSON.parse(JSON.stringify(result));
          let ran = getRandomNumber(0, resultRecipe.length - 1);
          if (ran == null) {
            res.status(400).send("Random method failed");
          } else {
            res.status(200).send(resultRecipe[ran]);
          }
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

const compareRecipeUser = async (req: Request, res: Response) => {
  const dbConnUser = await getUserDb();
  const dbConnRecipe = await getRecipeDb();

  let coll: string = UID_FORMAT + req.params.collection;
  let returnQuantity: number = parseInt(req.params.returnQuantity) - 1;

  if (returnQuantity > MAX_RETURN_QUANTITY) {
    returnQuantity = MAX_RETURN_QUANTITY;
  }

  const aggDocUser = [
    {
      $unwind: {
        path: "$container",
      },
    },
    {
      $project: {
        ingredient: "$container.itemName",
      },
    },
    {
      $sort: {
        ingredient: -1,
      },
    },
  ];
  const aggDocRecipe = [
    {
      $project: {
        _id: "$_id",
        title: "$title",
        ingredients: "$ingredients",
        tags: "$tags",
        category: "$category",
        uri: "$uri",
      },
    },
  ];

  let userResult: UserObject[] = [];
  let recipeResult: RecipeObject[] = [];
  let tmpArray: RecipeObject[] = [];
  let duplicateArray: RecipeCompareObject[] = [];
  let resultArray: RecipeObject[] = [];

  try {
    dbConnUser //Connection to user database to gather user ingredients
      .collection(coll)
      .aggregate(aggDocUser)
      .toArray((err, resUser) => {
        if (err) {
          res.status(400).send(err);
        } else {
          userResult = JSON.parse(JSON.stringify(resUser)); //Stringifies the contents

          dbConnRecipe //Connection to recipe database to gather recipes
            .collection(RECIPE_COLLECTION)
            .aggregate(aggDocRecipe)
            .toArray((err, resRecipe) => {
              if (err) {
                res.status(400).send(err);
              } else {
                recipeResult = JSON.parse(JSON.stringify(resRecipe)); //Stringifies the content

                let userCounter: number = 0;

                while (userCounter < userResult.length) {
                  // loop through user result
                  let recipeCounter: number = 0;

                  while (recipeCounter < recipeResult.length) {
                    //loop through recipes
                    let ingredientCounter: number = 0;

                    while (
                      ingredientCounter <
                      recipeResult[recipeCounter].tags.length
                    ) {
                      //loop through ingredients

                      //regexCompare("kylling filet", "kylling")
                      if (
                        regexCompare(
                          recipeResult[recipeCounter].tags[ingredientCounter],
                          userResult[userCounter].ingredient
                        )
                      ) {
                        tmpArray.push(recipeResult[recipeCounter]);
                      } // if check

                      ingredientCounter++;
                    } // while ingredientcounter

                    recipeCounter++;
                  } // while recipeCounter

                  userCounter++;
                } // while userCounter

                duplicateArray = tmpArray.map((a) => {
                  return { ...a };
                }); //duplicates the tmpArray

                // initialize counters
                let primaryCounter: number = 0;
                let secondaryCounter: number = 0;
                let duplicateCounter: number = 0;

                while (
                  primaryCounter < tmpArray.length &&
                  resultArray.length <= returnQuantity
                ) {
                  secondaryCounter = 0;
                  duplicateCounter = 0;

                  while (secondaryCounter < tmpArray.length) {
                    if (
                      duplicateArray[secondaryCounter]._id != "null" &&
                      tmpArray[primaryCounter]._id ===
                        duplicateArray[secondaryCounter]._id
                    ) {
                      duplicateArray[secondaryCounter]._id = "null";
                      duplicateCounter++;

                      if (duplicateCounter == NEEDED_INGREDIENTS) {
                        resultArray.push(tmpArray[primaryCounter]);
                      } // if neededIng
                    } // if title === title
                    secondaryCounter++;
                  } // while secondaryCounter
                  primaryCounter++;
                } // while primaryCounter

                if (
                  resultArray.length <= returnQuantity &&
                  returnQuantity <= MAX_RETURN_QUANTITY
                ) {
                  while (resultArray.length <= returnQuantity) {
                    let ran = getRandomNumber(0, recipeResult.length - 1);

                    if (ran == null) {
                      res.status(400).send("Random method failed");
                    } else {
                      if (!resultArray.includes(recipeResult[ran]))
                        resultArray.push(recipeResult[ran]);
                    } // if else
                  } // while resultarray is not long enough
                  res.status(200).send(resultArray);
                } else {
                  res.status(200).send(resultArray);
                } // if else returnQuantity
              } // else
            }); // toArray
        } // else
      }); // toArray
  } catch (error) {
    res.status(400).send(error);
  } // try/catch
}; // test method

function getRandomNumber(min: number, max: number): number | null {
  let master_min = 1;
  let master_max = 11;

  let even = Math.floor(Math.random() * (max - min + 1)) + min;
  let odd = Math.floor(Math.random() * (max - min + 1)) + min;

  let master =
    Math.floor(Math.random() * (master_max - master_min + 1)) + master_min;

  if (master % 2 == 0) {
    return even;
  }
  if (master % 2 == 1) {
    return odd;
  } else {
    return null;
  }
}

function regexCompare(
  userIngredient: string,
  recipeIngredient: string
): boolean {
  userIngredient = userIngredient.trim().toLowerCase().replace(/\s/g, "");
  recipeIngredient = recipeIngredient.trim().toLowerCase().replace(/\s/g, "");

  if (userIngredient.match(recipeIngredient)) {
    return true;
  } else {
    return false;
  }
}

export default {
  getAllRecipes,
  getOneRecipe,
  searchIngredientInRecipes,
  searchForRecipe,
  getRandomRecipe,
  compareRecipeUser,
};
