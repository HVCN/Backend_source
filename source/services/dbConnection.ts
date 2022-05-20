import { MongoClient, Collection, Db } from "mongodb";

export const collections: { items?: Collection } = {};

let client: MongoClient;
let userDb: Db;
let recipeDb: Db;

export async function connectToDatabase(
  userDatabase: string,
  recipeDatabase: string
) {
  const URL: any = process.env.DB_URL;

  client = new MongoClient(URL);
  await client.connect();

  userDb = client.db(userDatabase);
  recipeDb = client.db(recipeDatabase);

  console.log(`Successfully connected to database: ${userDb.databaseName}`);
  console.log(`Successfully connected to database: ${recipeDb.databaseName}`);
}

export async function getUserDb() {
  return userDb;
}

export async function getRecipeDb() {
  return recipeDb;
}
