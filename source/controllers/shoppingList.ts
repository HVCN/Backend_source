import { Request, Response } from "express";
import { getUserDb } from "../services/dbConnection";

import { SHOPPING_LIST_TYPE, UID_FORMAT } from "../constants/index";
import { ObjectId } from "mongodb";

const getShoppingLists = async (req: Request, res: Response) => {
  const dbConn = await getUserDb(); //creates the dbConnection

  let coll: string = UID_FORMAT + req.params.collection; //Readies the input in variables

  const aggDoc = [
    {
      $match: {
        type: SHOPPING_LIST_TYPE,
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];

  try {
    dbConn
      .collection(coll)
      .aggregate(aggDoc)
      .toArray((err, result) => {
        //finds the lists
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
}; //getShoppingLists

const getShoppingList = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection; //Readies the input in variables
  let id: ObjectId = new ObjectId(req.params.id);

  const aggDoc = [
    {
      $match: {
        type: SHOPPING_LIST_TYPE,
        _id: id,
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
}; //getShoppingList

const addItemShoppingList = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection; //Readies the input in variables
  let id: ObjectId = new ObjectId(req.body.id);
  let itemName: string = req.body.itemName;

  try {
    dbConn
      .collection(coll)
      .updateOne(
        { _id: id, type: SHOPPING_LIST_TYPE },
        { $push: { shoppingList: itemName } }
      )
      .then(function (result) {
        if (result.modifiedCount == 0) {
          res.status(202).send("Item was not added");
        } else if (result.modifiedCount == 1) {
          res.status(200).send("Item added"); //Sends 200 confirmation code to end the query
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
}; //addItemShoppingList

const deleteItemShoppingList = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection; //Readies the input in variables
  let id: ObjectId = new ObjectId(req.body.id);
  let itemName: string = req.body.itemName;

  try {
    dbConn
      .collection(coll)
      .updateOne(
        { _id: id, type: SHOPPING_LIST_TYPE },
        { $pull: { shoppingList: itemName } }
      )
      .then(function (result) {
        if (result.modifiedCount == 0) {
          res.status(202).send("Item was not found");
        } else if (result.modifiedCount == 1) {
          res.status(204).send("Item deleted"); //Sends 200 confirmation code to end the query
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
}; //deleteItemShoppingList

const addShoppingList = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection; //Readies the input in variables
  let listName: any = req.body.listName;

  let newList = {
    listName: listName,
    type: SHOPPING_LIST_TYPE,
    archived: false,
    shoppingList: [],
  };

  try {
    dbConn.collection(coll).insertOne(newList, function (result) {
      res.status(200).send(newList);
    });
  } catch (error) {
    res.status(400).send(error);
  }
}; //addShoppingList

const deleteShoppingList = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection; //Readies the input in variables
  let id: ObjectId = new ObjectId(req.body.id);

  try {
    dbConn.collection(coll).deleteOne({ _id: id }, function (err, result) {
      if (result?.deletedCount == 0) {
        res.status(200).send("Could not find list");
      } else if (result?.deletedCount == 1) {
        res.status(204).send("List deleted");
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
}; //deleteShoppingList

// returns the updated shopping list as a single object. Not nested in an array
const archiveShoppingList = async (req: Request, res: Response) => {
  // another comment to reboot the server
  try {
    const dbConn = await getUserDb();

    let coll = UID_FORMAT + req.params.collection;
    let id: ObjectId = new ObjectId(req.body.id);
    let archivedStatus: boolean = req.body.archived;

    const update = {
      $set: {
        _id: id,
        archived: archivedStatus,
      },
    };

    await dbConn
      .collection(coll)
      .findOneAndUpdate({ _id: id }, update, { returnDocument: "after" })
      .then((updatedDoc) => {
        if (updatedDoc.value) {
          res.status(200).json(updatedDoc.value);
        } else {
          res.status(400).json({});
        }
        return updatedDoc;
      })
      .catch((err) => {
        res.status(400).send("Failed to find and update the list");
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {
  getShoppingLists,
  getShoppingList,
  addItemShoppingList,
  deleteItemShoppingList,
  addShoppingList,
  deleteShoppingList,
  archiveShoppingList,
};
