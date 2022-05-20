import { Request, Response } from "express";
import {
  EXCLUDED,
  FREEZER_TYPE,
  FRIDGE_TYPE,
  PANTRY_TYPE,
  UID_FORMAT,
} from "../constants";
import { getUserDb } from "../services/dbConnection";
import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  projectId: "foodomatic-3c7c1",
  keyFilename: "service-account.json",
});

const scanReceipt = async (req: Request, res: Response) => {
  try {
    let uri = req.body.uri;

    const [result] = await client.textDetection(uri);

    const detections = result.textAnnotations;
    if (result && detections) {
      if (detections.length > 0) {
        // if (detections[0].description) {
        //   console.log(detections[0].description);
        //   res.send(detections[0].description);
        // }
        let resultArray = detections[0].description
          ?.split(/\r?\n/)
          .filter((string: string) => {
            if (!EXCLUDED.includes(string.toLowerCase())) return string;
          });

        res.status(200).send(resultArray);
      }
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

let addToArray = async (connection: any, array: any, type: string) => {
  let i: number = 0;
  while (i < array.length) {
    connection.updateOne(
      { type: type },
      {
        $push: {
          container: {
            itemName: array[i].itemName,
            expirationDate: array[i].expirationDate,
          },
        },
      }
    );
    i = i + 1;
  }
};

const insertManyOcr = async (req: Request, res: Response) => {
  const dbConn = await getUserDb();

  type item = {
    itemName: String;
    expirationDate: Date;
  };

  let coll: string = UID_FORMAT + req.params.collection;

  let document: {}[] = req.body.document;

  let fridgeArray: {}[] = [];
  let freezerArray: {}[] = [];
  let pantryArray: {}[] = [];

  try {
    document.map((index: any) => {
      if (index.type == FRIDGE_TYPE) {
        let date: Date = new Date(index.expirationDate);
        let obj: item = {
          itemName: index.itemName,
          expirationDate: new Date(date),
        };
        fridgeArray.push(obj);
      }
      if (index.type == FREEZER_TYPE) {
        let date: Date = new Date(index.expirationDate);
        let obj: item = {
          itemName: index.itemName,
          expirationDate: date,
        };
        freezerArray.push(obj);
      }
      if (index.type == PANTRY_TYPE) {
        let date: Date = new Date(index.expirationDate);
        let obj: item = {
          itemName: index.itemName,
          expirationDate: date,
        };
        pantryArray.push(obj);
      }
    });

    const connection = dbConn.collection(coll);

    if (fridgeArray.length > 0) {
      addToArray(connection, fridgeArray, FRIDGE_TYPE);
    }
    if (freezerArray.length > 0) {
      addToArray(connection, freezerArray, FREEZER_TYPE);
    }
    if (pantryArray.length > 0) {
      addToArray(connection, pantryArray, PANTRY_TYPE);
    }

    res.status(201).send("Items added");
  } catch (error) {
    res.status(400).send(error);
  }
};
export default { scanReceipt, insertManyOcr };
