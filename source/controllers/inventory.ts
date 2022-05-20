//Import needed packages from modules
import { Request, Response } from "express";
import { getUserDb } from "../services/dbConnection";

import {
  SHOPPING_LIST_TYPE,
  UID_FORMAT,
  FREEZER_TYPE,
  FRIDGE_TYPE,
  PANTRY_TYPE,
  EXPIRATION_DATE_LIMIT,
} from "../constants/index";
import { ObjectId } from "mongodb";

//below are the logic for the API, meaning what the API does or called controllers

//logic for getting all posts
const getAllItems = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let aggDoc = [
    {
      $match: {
        $or: [
          {
            type: FREEZER_TYPE,
          },
          {
            type: FRIDGE_TYPE,
          },
          {
            type: PANTRY_TYPE,
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$container",
      },
    },
    {
      $project: {
        _id: "$container._id",
        type: "$type",
        itemName: "$container.itemName",
        expirationDate: "$container.expirationDate",
      },
    },
    {
      $sort: {
        itemName: 1,
      },
    },
  ];

  let coll: string = UID_FORMAT + req.params.collection;

  try {
    dbConn
      .collection(coll)
      .aggregate(aggDoc)
      .toArray((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          if (result?.length == 0) {
            res.status(204).send("Empty, non-existent user.");
          } else {
            res.status(200).send(result);
          }
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
}; //getAllItems

const getAllItemsType = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;
  let type: string = req.params.type;

  const aggDoc = [
    {
      $match: {
        type: type,
      },
    },
    {
      $unwind: {
        path: "$container",
      },
    },
    {
      $project: {
        _id: "$container._id",
        location: "$location",
        type: "$type",
        itemName: "$container.itemName",
        expirationDate: "$container.expirationDate",
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
}; //getAllItems

const getSpecificItem = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;
  let type: string = req.params.type;
  let location: string = req.params.location;
  let id: ObjectId = new ObjectId(req.params.id);

  const aggDoc = [
    {
      $match: {
        type: type,
        location: location,
      },
    },
    {
      $unwind: {
        path: "$container",
      },
    },
    {
      $project: {
        _id: "$container._id",
        location: "$location",
        type: "$type",
        itemName: "$container.itemName",
        expirationDate: "$container.expirationDate",
      },
    },
    {
      $match: {
        _id: id,
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
}; //getSpecificItem

//logic for updating a post
const updateItem = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;

  let type: string = req.body.type;
  let location: string = req.body.location;
  let id: ObjectId = new ObjectId(req.body.id);

  let newItemName: string = req.body.newItemName;
  let newDate: Date = new Date(req.body.newExpirationDate);

  try {
    dbConn
      .collection(coll)
      .updateOne(
        {
          type: type,
          location: location,
          "container._id": id,
        },
        {
          $set: {
            "container.$._id": id,
            "container.$.itemName": newItemName,
            "container.$.expirationDate": newDate,
          },
        }
      )
      .then(function (result) {
        if (result.modifiedCount == 1) {
          res.status(200).send(`Item ${id} updated`);
        } else if (result.modifiedCount == 0) {
          res
            .status(418)
            .send(
              `Item ${id} not found or no new data, and the server is a teapot`
            );
        } else {
          res.status(400).send(result);
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
}; //updateItem

//logic for deleting a post
const deleteItem = async (req: Request, res: Response) => {
  //TODO use document id instead of location and type?
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;
  let type: string = req.body.type;
  let location: string = req.body.location;
  let id: ObjectId = new ObjectId(req.body.id);

  try {
    dbConn
      .collection(coll)
      .updateOne(
        { type: type, location: location },
        {
          $pull: {
            container: {
              _id: id,
            },
          },
        }
      )
      .then(function (result) {
        if (result.modifiedCount == 0) {
          res.status(200).send("Item not found, nothing deleted");
        } else {
          res.status(204).send("Item deleted"); //sends 200 confirmation to end query
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
}; //deletePost

//logic for adding a post
const addItem = async (req: Request, res: Response) => {
  //TODO use document id instead of location and type?
  //adds the data from the request to variables
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;

  let type: string = req.body.type;
  let location: string = req.body.location;
  let itemName: string = req.body.itemName;
  let date: Date = new Date(req.body.expirationDate);

  let objectId: ObjectId = new ObjectId();
  console.log(objectId);
  try {
    dbConn
      .collection(coll)
      .updateOne(
        { type: type, location: location },
        {
          $push: {
            container: {
              _id: objectId,
              itemName: itemName,
              expirationDate: date,
            },
          },
        }
      )
      .then(function (result) {
        if (result.modifiedCount == 0) {
          res.status(202).send("Item was not created");
        } else if (result.modifiedCount == 1) {
          res.status(201).send("Item created"); //sends 200 confirmation to end query
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
}; //addPost

const searchItem = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;
  let itemName = req.params.itemName;

  const aggDoc = [
    {
      $match: {
        type: {
          $ne: SHOPPING_LIST_TYPE,
        },
      },
    },
    {
      $unwind: {
        path: "$container",
      },
    },
    {
      $project: {
        _id: "$container._id",
        itemName: "$container.itemName",
        expirationDate: "$container.expirationDate",
        type: "$type",
      },
    },
    {
      $match: {
        itemName: {
          $regex: itemName,
          $options: "i, x",
        },
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
      .collection(coll)
      .aggregate(aggDoc)
      .toArray((err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          if (result?.length == 0) {
            res.status(204).send("Item not found");
          } else {
            res.status(200).send(result);
          }
        }
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getExpiringItems = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  let coll: string = UID_FORMAT + req.params.collection;

  const aggDoc = [
    {
      $match: {
        type: {
          $ne: SHOPPING_LIST_TYPE,
        },
      },
    },
    {
      $unwind: {
        path: "$container",
      },
    },
    {
      $project: {
        _id: "$container._id",
        itemName: "$container.itemName",
        expirationDate: "$container.expirationDate",
      },
    },
    {
      $sort: {
        expirationDate: 1,
      },
    },
    {
      $limit: EXPIRATION_DATE_LIMIT,
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
};

export default {
  getAllItems,
  getAllItemsType,
  getSpecificItem,
  updateItem,
  deleteItem,
  addItem,
  searchItem,
  getExpiringItems,
}; //export the api functions
