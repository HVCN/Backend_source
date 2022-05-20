import { Request, Response } from "express";
import { getUserDb } from "../services/dbConnection";

import { InventoryTemplate } from "../types/index";

import {
  DEFAULT_LOCATION,
  FREEZER_TYPE,
  FRIDGE_TYPE,
  PANTRY_TYPE,
  UID_FORMAT,
  WEEKDAYS,
  WEEKLYMENU_TYPE
} from "../constants/index";
//import the required modules and variables

const newUser = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  const freezerTemplate: InventoryTemplate = {
    location: DEFAULT_LOCATION,
    type: FREEZER_TYPE,
    container: [],
  };
  const fridgeTemplate: InventoryTemplate = {
    location: DEFAULT_LOCATION,
    type: FRIDGE_TYPE,
    container: [],
  };
  const pantryTemplate: InventoryTemplate = {
    location: DEFAULT_LOCATION,
    type: PANTRY_TYPE,
    container: [],
  };

  const weeklyMenuTemplate = {
    type: WEEKLYMENU_TYPE,
    weekDays: WEEKDAYS,
  };

  const insertionDocument = [
    freezerTemplate,
    fridgeTemplate,
    pantryTemplate,
    weeklyMenuTemplate,
  ];

  const UID: string = UID_FORMAT + req.params.uid; //readies the UID

  try {
    dbConn.listCollections({ name: UID }).next(async function (err, result) {
      if (result) {
        res.status(403).send("User already exists!");
        console.log();
      } else {
        dbConn.createCollection(UID, function (err, result) {
          dbConn.collection(UID).insertMany(insertionDocument);
          res.status(204).send("User and collections created!");
        });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
}; //newUser

const deleteUser = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  const UID: string = UID_FORMAT + req.params.uid; //readies the UID

  try {
    dbConn.collection(UID).drop(function (err, del) {
      if (err) {
        res.status(404).send(`User/Collection ${UID} does not exist`);
      }
      if (del) {
        res.status(204).send(`User/Collection ${UID} deleted`);
      }
    });
  } catch (error) {
    res.send(400).send(error);
  }
}; //deleteUser

export default { newUser, deleteUser };
