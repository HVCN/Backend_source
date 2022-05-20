import { Request, Response } from "express";
import { RECIPE_COLLECTION, UID_FORMAT, WEEKLYMENU_TYPE } from "../constants";
import { getRecipeDb, getUserDb } from "../services/dbConnection";
import {
  ResultWeeklyMenu,
  WeeklyMenuRecipeType,
  WeeklyMenuUserType,
} from "../types";

/* const getWeeklyMenu = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;

  const aggDoc = [
    {
      $match: {
        type: WEEKLYMENU_TYPE,
      },
    },
  ];

  try {
    dbConn
      .collection(coll)
      .aggregate(aggDoc)
      .toArray((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          if (result?.length == 0) {
            res.status(204).send("Empty");
          } else {
            res.status(200).send(result);
          }
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
}; */

const updateWeeklyMenu = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;

  let weekDay: number = req.body.weekDay;
  let newId: string = req.body.newId;

  try {
    dbConn
      .collection(coll)
      .updateOne(
        { "weekDays.weekDay": weekDay, type: WEEKLYMENU_TYPE },
        {
          $set: {
            "weekDays.$.id": newId,
          },
        }
      )
      .then(function (result) {
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteMenuDay = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;

  let weekDay: number = req.body.weekDay;

  try {
    dbConn
      .collection(coll)
      .updateOne(
        { "weekDays.weekDay": weekDay, type: WEEKLYMENU_TYPE },
        {
          $set: {
            "weekDays.$.id": "",
          },
        }
      )
      .then(function (result) {
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getWeeklyMenu = async (req: Request, res: Response) => {
  const dbConnUser = await getUserDb();
  const dbConnRecipe = await getRecipeDb();

  const aggDocUser = [
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

  const aggDocRecipe = [
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

  let coll: string = UID_FORMAT + req.params.collection;

  let userResult: WeeklyMenuUserType[] = [];
  let recipeResult: WeeklyMenuRecipeType[] = [];
  let resultArray: ResultWeeklyMenu[] = [];
  try {
    dbConnUser
      .collection(coll)
      .aggregate(aggDocUser)
      .toArray((err, resUser) => {
        if (err) {
          res.status(400).send(err);
        } else {
          userResult = JSON.parse(JSON.stringify(resUser)); //Stringifies the contents
          dbConnRecipe
            .collection(RECIPE_COLLECTION)
            .aggregate(aggDocRecipe)
            .toArray((err, resRecipe) => {
              if (err) {
                res.status(400).send(err);
              } else {
                recipeResult = JSON.parse(JSON.stringify(resRecipe)); //Stringifies the contents
                let userCounter: number = 0;
                while (userCounter < userResult.length) {
                  let recipeCounter: number = 0;
                  let weekDayCounter: number = 0;
                  let insertedCheck: boolean = false;
                  while (recipeCounter < recipeResult.length) {
                    if(!insertedCheck){
                      let emptyObj: ResultWeeklyMenu = {
                        weekday: userResult[userCounter].weekDay,
                        _id: "",
                      }
                      resultArray.push(emptyObj)
                      insertedCheck = true
                    }
                      if (
                        userResult[userCounter]._id ===
                        recipeResult[recipeCounter]._id
                      ) {
                        resultArray.pop();
                        let insertionObject: ResultWeeklyMenu = {
                          weekday: userResult[userCounter].weekDay,
                          _id: recipeResult[recipeCounter]._id,

                          title: recipeResult[recipeCounter].title,

                          ingredients: recipeResult[recipeCounter].ingredients,

                          tags: recipeResult[recipeCounter].tags,

                          category: recipeResult[recipeCounter].category,

                          uri: recipeResult[recipeCounter].uri,

                          steps: recipeResult[recipeCounter].steps,
                        }; // insertionobject
                        resultArray.push(insertionObject);

                        weekDayCounter++;
                    } // compare if
                    recipeCounter++;
                  } // recipe while
                  userCounter++;
                } // user while
                if (resultArray.length == 0) {
                  res.status(204).send(resultArray);
                } else {
                  res.status(200).send(resultArray);
                } // if content
              } // recipe else
            }); // recipeDbConn
        } // user else
      }); // userDbConn
  } catch (err) {
    res.status(400).send(err);
  }
};
export default {
  getWeeklyMenu,
  updateWeeklyMenu,
  deleteMenuDay,
};
