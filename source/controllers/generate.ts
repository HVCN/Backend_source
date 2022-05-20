import { Request, Response } from "express";
import { getRecipeDb, getUserDb } from "../services/dbConnection";

import {
  RECIPE_COLLECTION,
  MAX_RETURN_QUANTITY,
  UID_FORMAT,
  NEEDED_INGREDIENTS,
  WEEKLYMENU_TYPE,
} from "../constants/index";

import {
  RecipeObject,
  RecipeCompareObject,
  UserObject,
  WeeklyMenuUserType,
  WeeklyMenuRecipeType,
  ResultWeeklyMenu,
} from "../types/index";

const generateWeeklyMenu = async (req: Request, res: Response) => {
  const dbConnUser = await getUserDb();
  const dbConnRecipe = await getRecipeDb();

  let coll: string = UID_FORMAT + req.params.collection;
  let returnQuantity: number = 6;

  if (returnQuantity > MAX_RETURN_QUANTITY) {
    returnQuantity = MAX_RETURN_QUANTITY;
  }

  /**
   * Stage 1 = Filling an array with recipes based on inventory
   * Stage 2 = Updating weeklymenu with the id's
   * Stage 3 = Returning recipe information
   */

  const aggDocUserStage1 = [
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
  const aggDocRecipeStage1 = [
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

  const aggDocUserStage3 = [
    {
      $match: {
        type: WEEKLYMENU_TYPE,
      },
    },
    {
      $unwind: {
        path: "$weekDays",
      },
    },
    {
      $project: {
        _id: "$weekDays.id",
        weekDay: "$weekDays.weekDay",
      },
    },
  ];

  const aggDocRecipeStage3 = [
    {
      $project: {
        _id: "$_id",
        title: "$title",
        ingredients: "$ingredients",
        tags: "$tags",
        category: "$category",
        uri: "$uri",
        steps: "$steps",
      },
    },
  ];

  let userResultStage1: UserObject[] = [];
  let recipeResultStage1: RecipeObject[] = [];
  let tmpArrayStage1: RecipeObject[] = [];
  let duplicateArrayStage1: RecipeCompareObject[] = [];
  let resultArrayStage1: RecipeObject[] = [];

  let userResultStage3: WeeklyMenuUserType[] = [];
  let recipeResultStage3: WeeklyMenuRecipeType[] = [];
  let resultArrayStage3: ResultWeeklyMenu[] = [];

  try {
    //STAGE 1 START
    dbConnUser
      .collection(coll) //Connection to user database to gather user ingredients
      .aggregate(aggDocUserStage1)
      .toArray((err, resUser) => {
        if (err) {
          res.status(400).send(err);
        } else {
          userResultStage1 = JSON.parse(JSON.stringify(resUser)); //Stringifies the contents

          dbConnRecipe //Connection to recipe database to gather recipes
            .collection(RECIPE_COLLECTION)
            .aggregate(aggDocRecipeStage1)
            .toArray((err, resRecipe) => {
              if (err) {
                res.status(400).send(err);
              } else {
                recipeResultStage1 = JSON.parse(JSON.stringify(resRecipe)); //Stringifies the content

                let userCounter: number = 0;

                while (userCounter < userResultStage1.length) {
                  // loop through user result
                  let recipeCounter: number = 0;

                  while (recipeCounter < recipeResultStage1.length) {
                    //loop through recipes
                    let ingredientCounter: number = 0;

                    while (
                      ingredientCounter <
                      recipeResultStage1[recipeCounter].tags.length
                    ) {
                      //loop through ingredients

                      //regexCompare("kylling filet", "kylling")
                      if (
                        regexCompare(
                          recipeResultStage1[recipeCounter].tags[
                            ingredientCounter
                          ],
                          userResultStage1[userCounter].ingredient
                        )
                      ) {
                        tmpArrayStage1.push(recipeResultStage1[recipeCounter]);
                      } // if check

                      ingredientCounter++;
                    } // while ingredientcounter

                    recipeCounter++;
                  } // while recipeCounter

                  userCounter++;
                } // while userCounter

                duplicateArrayStage1 = tmpArrayStage1.map((a) => {
                  return { ...a };
                }); //duplicates the tmpArray

                // initialize counters
                let primaryCounter: number = 0;
                let secondaryCounter: number = 0;
                let duplicateCounter: number = 0;

                while (
                  primaryCounter < tmpArrayStage1.length &&
                  resultArrayStage1.length <= returnQuantity
                ) {
                  secondaryCounter = 0;
                  duplicateCounter = 0;

                  while (secondaryCounter < tmpArrayStage1.length) {
                    if (
                      duplicateArrayStage1[secondaryCounter]._id != "null" &&
                      tmpArrayStage1[primaryCounter]._id ===
                        duplicateArrayStage1[secondaryCounter]._id
                    ) {
                      duplicateArrayStage1[secondaryCounter]._id = "null";
                      duplicateCounter++;

                      if (duplicateCounter == NEEDED_INGREDIENTS) {
                        resultArrayStage1.push(tmpArrayStage1[primaryCounter]);
                      } // if neededIng
                    } // if title === title
                    secondaryCounter++;
                  } // while secondaryCounter
                  primaryCounter++;
                } // while primaryCounter

                if (
                  resultArrayStage1.length <= returnQuantity &&
                  returnQuantity <= MAX_RETURN_QUANTITY
                ) {
                  while (resultArrayStage1.length <= returnQuantity) {
                    let ran = getRandomNumber(0, recipeResultStage1.length - 1);

                    if (ran == null) {
                      res.status(400).send("Random method failed");
                    } else {
                      if (!resultArrayStage1.includes(recipeResultStage1[ran]))
                        resultArrayStage1.push(recipeResultStage1[ran]);
                    } // if else
                  } // while resultarray is not long enough
                }// if returnQuantity
                //STAGE 1 - COMPLETE

                //STAGE 2 - START
                
                let weeklyMenuInsertion = {
                  type: WEEKLYMENU_TYPE,
                  weekDays: [
                    {
                      weekDay: 0,
                      id: resultArrayStage1[0]._id
                    },
                    {
                      weekDay: 1,
                      id: resultArrayStage1[1]._id
                    },
                    {
                      weekDay: 2,
                      id: resultArrayStage1[2]._id
                    },
                    {
                      weekDay: 3,
                      id: resultArrayStage1[3]._id
                    },
                    {
                      weekDay: 4,
                      id: resultArrayStage1[4]._id
                    },
                    {
                      weekDay: 5,
                      id: resultArrayStage1[5]._id
                    },
                    {
                      weekDay: 6,
                      id: resultArrayStage1[6]._id
                    }
                  ]
                }
                
                  dbConnUser.collection(coll).deleteOne({type:WEEKLYMENU_TYPE}, function(err, obj){
                    if(err){
                      res.status(400).send(err)
                    }
                    else {
                    dbConnUser.collection(coll).insertOne(weeklyMenuInsertion, function(err, obj){
                      if (err){
                        res.status(400).send(err)
                      } else {
                        // STAGE 2 - COMPLETE;
                        // STAGE 3 - STARTING

                        dbConnUser
                          .collection(coll)
                          .aggregate(aggDocUserStage3)
                          .toArray((err, resUserStage3) => {
                            if (err) {
                              res.status(400).send(err);
                            } else {
                              userResultStage3 = JSON.parse(
                                JSON.stringify(resUserStage3)
                              ); //Stringifies the contents
                              dbConnRecipe
                                .collection(RECIPE_COLLECTION)
                                .aggregate(aggDocRecipeStage3)
                                .toArray((err, resRecipeStage3) => {
                                  if (err) {
                                    res.status(400).send(err);
                                  } else {
                                    recipeResultStage3 = JSON.parse(
                                      JSON.stringify(resRecipeStage3)
                                    ); //Stringifies the contents
                                    let userCounterStage3: number = 0;
                                    while (
                                      userCounterStage3 < userResultStage3.length
                                    ) {
                                      let recipeCounterStage3: number = 0;
                                      while (
                                        recipeCounterStage3 < recipeResultStage3.length
                                      ) {
                                        if (
                                          userResultStage3[userCounterStage3]._id ===
                                          recipeResultStage3[recipeCounterStage3]._id
                                        ) {
                                          let insertionObjectStage3: ResultWeeklyMenu =
                                            {
                                              weekday:
                                                userResultStage3[userCounterStage3]
                                                  .weekDay,
                                              _id: recipeResultStage3[
                                                recipeCounterStage3
                                              ]._id,

                                              title:
                                                recipeResultStage3[recipeCounterStage3]
                                                  .title,

                                              ingredients:
                                                recipeResultStage3[recipeCounterStage3]
                                                  .ingredients,

                                              tags: recipeResultStage3[
                                                recipeCounterStage3
                                              ].tags,

                                              category:
                                                recipeResultStage3[recipeCounterStage3]
                                                  .category,

                                              uri: recipeResultStage3[
                                                recipeCounterStage3
                                              ].uri,

                                              steps:
                                                recipeResultStage3[recipeCounterStage3]
                                                  .steps,
                                            }; // insertionobject
                                          resultArrayStage3.push(insertionObjectStage3);
                                          //weekDayCounter++;
                                        } // compare if
                                        recipeCounterStage3++;
                                      } // recipe while
                                      userCounterStage3++;
                                    } // user while
                                    if (resultArrayStage3.length == 0) {
                                      res.status(204).send(resultArrayStage3);
                                      // STAGE 3 - COMPLETE
                                    } else {
                                      // STAGE 3 - COMPLETE
                                      res.status(200).send(resultArrayStage3);
                                    } // if content
                                  } // recipe else
                                }); // recipeDbConn
                            } // user else
                          }); // userDbConn
                      }
                    });
                    }
                  })
              } // else
            }); // toArray
        } // else
      }); // toArray
  } catch (error) {
    res.sendStatus(400);
  }
};

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

export default { generateWeeklyMenu };
