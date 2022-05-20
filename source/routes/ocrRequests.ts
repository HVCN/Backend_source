import express from "express"; //import express module
import ocrController from "../controllers/ocr"; //import the api logic

const ocrRouter = express.Router(); //creates a shortcut

ocrRouter.post("/scan", ocrController.scanReceipt);
ocrRouter.post("/insertMany/:collection", ocrController.insertManyOcr);

export default { ocrRouter }; // exports the routes
