module.exports = {
  //BASIC INFO
  openapi: "3.0.3",
  info: {
    title: "Foodomatic API",
    description: "API that serves the foodomatic app",
    version: "420.69",
    contact: {
      email: "HVCN.foodomatic@gmail.com",
      url: "hvcn.com",
    },
  },

  //SERVER CONFIGURATION
  servers: [
    {
      url: "http://localhost:6060",
      description: "Local environement",
    },
    {
      url: "https://dev-foodomatic-api.herokuapp.com",
      description: "Development environement",
    },
    {
      url: "https://foodomatic-api.herokuapp.com/",
      description: "Production environement",
    },
  ],

  //API TAGS
  tags: [
    {
      name: "User",
      description: "API calls corresponding with users",
    },
    {
      name: "Inventory",
      description: "API calls corresponding with inventories",
    },
    {
      name: "ShoppingList",
      description: "API calls corresponding with shopping lists",
    },
    {
      name: "Recipe",
      description: "API calls corresponding with recipes",
    },
    {
      name: "OCR",
      description: "API calls corresponding with OCR",
    },
    {
      name: "WeeklyMenu",
      description: "API calls corresponding with weekly menu",
    },
  ],

  //SCHEMAS
  components: {
    schemas: {
      UID: {
        type: "string",
        description: "UID of the user",
        example: "jb68I8cMW0g7J5KKZNrsnj5hpOR2",
      },
      type: {
        type: "string",
        description: "Type of inventory",
        example: "fridge",
      },
      location: {
        type: "string",
        description: "Location of the inventory",
        example: "fridge",
      },
      id: {
        type: "string",
        description: "The id of the item or list in question",
        example: "62435607fcffcef5d66a6440",
      },
      itemName: {
        type: "string",
        description: "Name of the item",
        example: "Milk",
      },
      expirationDate: {
        type: "string",
        description: "The expiration date of the item",
        example: "06.08.1945",
      },
      newItemName: {
        type: "string",
        description: "The new item in question",
        example: "Butter",
      },
      newExpirationDate: {
        type: "string",
        description: "The expiration date of the new item",
        example: "09.08.1945",
      },
      ingredient: {
        type: "string",
        description: "The ingredient in question",
        example: "Rice",
      },
      title: {
        type: "string",
        description: "The title of the recipe",
        example: "Quesedilla",
      },
      name: {
        type: "string",
        description: "Name of the shopping list",
        example: "list",
      },
      uri: {
        type: "string",
        description: "URL of picture",
        example: "https://firebasestorage.googleapis.com/xxxx",
      },
      document: {
        type: "array",
        description: "Document from the OCR scan",
        example: [
          {
            expirationDate: "2022-03-03T12:53:32.146Z",
            itemName: "BRYNILD SUPERMIX",
            type: "pantry",
          },
          {
            expirationDate: "2022-03-03T12:53:32.146Z",
            itemName: "BRYNILD SUPERMIX",
            type: "pantry",
          },
        ],
      },
      returnQuantity: {
        type: "int",
        description:
          "Number of wanted recipes. (0 = 1 returned, 1 = 2 returned etc.)",
        example: 6,
      },
      weekDay: {
        type: "number",
        description: "Weekday in number: 0-6",
        example: 0,
      },
      newId: {
        type: "string",
        description: "The new recipe id",
        example: "61fcf0ae06b47b840c6a7a94",
      },
      archived: {
        type: "boolean",
        description: "List status",
        example: "true - list is active. false - list is archived",
      },
    },

    definitions: {
      inventory: {
        addItem: {
          description: "requestBody for addItem",
          type: "object",
          properties: {
            type: {
              $ref: "#/components/schemas/type",
            },
            location: {
              $ref: "#/components/schemas/location",
            },
            itemName: {
              $ref: "#/components/schemas/itemName",
            },
            expirationDate: {
              $ref: "#/components/schemas/expirationDate",
            },
          },
        },
        updateItem: {
          description: "requestBody for updateItem",
          type: "object",
          properties: {
            type: {
              $ref: "#/components/schemas/type",
            },
            location: {
              $ref: "#/components/schemas/location",
            },
            id: {
              $ref: "#/components/schemas/id",
            },
            newItem: {
              $ref: "#/components/schemas/newItemName",
            },
            newExpirationDate: {
              $ref: "#/components/schemas/newExpirationDate",
            },
          },
        },
        deleteItem: {
          description: "requestBody for deleteItem",
          type: "object",
          properties: {
            type: {
              $ref: "#/components/schemas/type",
            },
            location: {
              $ref: "#/components/schemas/location",
            },
            id: {
              $ref: "#/components/schemas/id",
            },
          },
        },
      },
      shoppingList: {
        addItem: {
          description: "requestBody for addItemShoppingList",
          type: "object",
          properties: {
            id: {
              $ref: "#/components/schemas/id",
            },
            itemName: {
              $ref: "#/components/schemas/itemName",
            },
          },
        },
        deleteItem: {
          description: "requestBody for deleteItemShoppingList",
          type: "object",
          properties: {
            id: {
              $ref: "#/components/schemas/id",
            },
            itemName: {
              $ref: "#/components/schemas/itemName",
            },
          },
        },
        addShoppingList: {
          description: "requestBody for addShoppingList",
          type: "object",
          properties: {
            name: {
              $ref: "#/components/schemas/name",
            },
          },
        },
        deleteShoppingList: {
          description: "requestBody for deleteShoppingList",
          type: "object",
          properties: {
            id: {
              $ref: "#/components/schemas/id",
            },
          },
        },
        archiveShoppingList: {
          description: "requestBody for archiveShoppingList",
          type: "object",
          properties: {
            id: {
              $ref: "#/components/schemas/id",
            },
            archived: {
              $ref: "#/components/schemas/archived",
            },
          },
        },
      },
      ocr: {
        scanReceipt: {
          description: "requestBody for scanReceipt",
          type: "object",
          properties: {
            uri: {
              $ref: "#/components/schemas/uri",
            },
          },
        },
        insertManyOcr: {
          description: "requestBody for insertManyOcr",
          type: "object",
          properties: {
            document: {
              $ref: "#/components/schemas/document",
            },
          },
        },
      },
      weeklyMenu: {
        updateWeeklyMenu: {
          description: "requestBody for updateWeekluMenu",
          type: "object",
          properties: {
            weekDay: {
              $ref: "#/components/schemas/weekDay",
            },
            newId: {
              $ref: "#/components/schemas/newId",
            },
          },
        },
        deleteWeeklyMenu: {
          description: "requestBody for deleteWeekluMenu",
          type: "object",
          properties: {
            weekDay: {
              $ref: "#/components/schemas/weekDay",
            },
          },
        },
      },
    },
  },

  //USER CALLS
  paths: {
    "/user/new/{UID}": {
      post: {
        tags: ["User"],
        description: "Create a user collection and standard documents",
        operationId: "addUsers",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        responses: {
          204: {
            description: "User and collections created!",
          },
          400: {
            description: "Bad request",
          },
          403: {
            description: "User already exists",
          },
        },
      },
    },
    "/user/delete/{UID}": {
      delete: {
        tags: ["User"],
        description: "Delete a user collection and documents",
        operationId: "deleteUser",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        responses: {
          204: {
            description: "User and collections deleted!",
          },
          400: {
            description: "Bad request",
          },
          404: {
            description: "User already exists",
          },
        },
      },
    },

    //INVENTORY CALLS
    "/inventory/{UID}": {
      get: {
        tags: ["Inventory"],
        description: "Get entire inventory of user",
        operationId: "getAllItems",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          204: {
            description: "Empty response, probably non-existent user.",
          },
          400: {
            description: "Bad Request",
          },
        },
      },
      post: {
        tags: ["Inventory"],
        description: "Add item to an inventory",
        operationId: "addItem",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/inventory/addItem",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Item created",
          },
          202: {
            description: "Item was not created, probably non-existent user",
          },
          400: {
            description: "Bad request",
          },
        },
      },
      put: {
        tags: ["Inventory"],
        description: "Update an item inside an inventory",
        operationId: "updateItem",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/inventory/updateItem",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success!",
          },
          400: {
            description: "Bad request",
          },
          418: {
            description:
              "Item not found or no new data, and the server is a teapot",
          },
        },
      },
      delete: {
        tags: ["Inventory"],
        description: "Delete an item inside an inventory",
        operationId: "deleteItem",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/inventory/deleteItem",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Item not found, nothing deleted",
          },
          204: {
            description: "Item deleted!!",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/inventory/{UID}/search/{itemName}": {
      get: {
        tags: ["Inventory"],
        description: "Search after items in inventory",
        operationId: "searchItem",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
          {
            name: "itemName",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/itemName",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          204: {
            description: "Item not found",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/inventory/{UID}/{type}": {
      get: {
        tags: ["Inventory"],
        description: "Get entire inventory type",
        operationId: "getAllItemsType",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
          {
            name: "type",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/type",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          204: {
            description: "Empty",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/inventory/{UID}/{type}/{location}": {
      get: {
        tags: ["Inventory"],
        description: "Get entire inventory of specific container",
        operationId: "getLocationItems",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
          {
            name: "type",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/type",
            },
          },
          {
            name: "location",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/location",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          204: {
            description: "Empty",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/inventory/{UID}/{type}/{location}/{itemName}": {
      get: {
        tags: ["Inventory"],
        description: "Get specific item in a specific container",
        operationId: "getSpecificItem",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
          {
            name: "type",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/type",
            },
          },
          {
            name: "location",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/location",
            },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/id",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          204: {
            description: "Empty",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/inventory/{UID}/expiration/search": {
      get: {
        tags: ["Inventory"],
        description: "Gets six items with the closest dates",
        operationId: "getExpiringItems",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          204: {
            description: "Empty, check request",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },

    //SHOPPINGLIST CALLS
    "/shoppingList/{UID}": {
      get: {
        tags: ["ShoppingList"],
        description: "Get all shopping lists from a user",
        operationId: "getAllShoppingLists",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          204: {
            description: "Empty, check UID",
          },
          400: {
            description: "Bad request",
          },
        },
      },
      put: {
        tags: ["ShoppingList"],
        description: "Add item to shopping list",
        operationId: "addItemShoppingList",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/shoppingList/addItem",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Item added",
          },
          202: {
            description: "Item was not added",
          },
          400: {
            description: "Bad request",
          },
        },
      },
      delete: {
        tags: ["ShoppingList"],
        description: "Delete item from shopping list",
        operationId: "deleteItemShoppingList",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/shoppingList/deleteItem",
              },
            },
          },
        },
        responses: {
          202: {
            description: "Item not found",
          },
          204: {
            description: "Item deleted",
          },
          400: {
            description: "Bad request",
          },
        },
      },
      post: {
        tags: ["ShoppingList"],
        description: "Add shopping list",
        operationId: "addShoppingList",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/shoppingList/addShoppingList",
              },
            },
          },
        },
        responses: {
          200: {
            description: "List created",
          },
          400: {
            description: "Bad request",
          },
          403: {
            description: "List already exists",
          },
        },
      },
    },
    "/shoppingList/{UID}/list": {
      delete: {
        tags: ["ShoppingList"],
        description: "Add shopping list",
        operationId: "deleteShoppingList",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/shoppingList/deleteShoppingList",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Could not find list",
          },
          204: {
            description: "List deleted",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/shoppingList/{UID}/{name}": {
      get: {
        tags: ["ShoppingList"],
        description: "Get a shopping list",
        operationId: "getShoppingList",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
          {
            name: "name",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/name",
            },
          },
        ],
        responses: {
          200: {
            description: "Found list",
          },
          204: {
            description: "Empty list",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/shoppingList/{UID}/archiveList": {
      put: {
        tags: ["ShoppingList"],
        description: "Updates the archived status of a shopping list",
        operationId: "archiveShoppingList",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/shoppingList/archiveShoppingList",
              },
            },
          },
        },
        responses: {
          200: {
            description: "List updated. Updated object is returned.",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },

    //RECIPE CALLS
    "/recipe/recipes": {
      get: {
        tags: ["Recipe"],
        description: "List all recipes",
        operationId: "getAllRecipes",
        responses: {
          200: {
            description: "Success!",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/recipe/ingredients/{ingredient}": {
      get: {
        tags: ["Recipe"],
        description: "Search in recipes with one ingredient",
        operationId: "searchIngredientRecipes",
        parameters: [
          {
            name: "ingredient",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/ingredient",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/recipe/search/{title}": {
      get: {
        tags: ["Recipe"],
        description: "Search after recipes",
        operationId: "searcForRecipe",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
          {
            name: "title",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/title",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/recipe/compare/{UID}/{returnQuantity}": {
      get: {
        tags: ["Recipe"],
        description: "Compare user contents to recipes",
        operationId: "compareRecipeUser",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
          {
            name: "returnQuantity",
            in: "path",
            schema: {
              $ref: "#/components/schemas/returnQuantity",
            },
          },
        ],
        responses: {
          200: {
            description: "Success!",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    //OCR calls
    "/ocr/scan": {
      post: {
        tags: ["OCR"],
        description: "OCR Scanning",
        operationId: "scanReceipt",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/ocr/scanReceipt",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Items scanned",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/ocr/{UID}": {
      post: {
        tags: ["OCR"],
        description: "OCR insert from document",
        operationId: "insertManyOcr",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/ocr/insertManyOcr",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Items added",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    //WeeklyMenu calls
    "/weeklymenu/{UID}": {
      get: {
        tags: ["WeeklyMenu"],
        description: "Get all menus for the week",
        operationId: "getWeeklyMenu",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          204: {
            description: "Error: Probably empty!",
          },
          400: {
            description: "Bad request",
          },
        },
      },
      put: {
        tags: ["WeeklyMenu"],
        description: "Change recipe at chosen day",
        operationId: "updateWeeklyMenu",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/weeklyMenu/updateWeeklyMenu",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          400: {
            description: "Bad request",
          },
        },
      },
      delete: {
        tags: ["WeeklyMenu"],
        description: "Remove recipe from chosen day",
        operationId: "deleteWeeklyMenu",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#components/schemas/UID",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/definitions/weeklyMenu/deleteWeeklyMenu",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
    "/weeklymenu/{UID}/generate": {
      get: {
        tags: ["WeeklyMenu"],
        description:
          "Generate the weeklymenu according to the users weeklyMenu document",
        operationId: "generateWeeklyMenu",
        parameters: [
          {
            name: "UID",
            in: "path",
            required: true,
            schema: {
              $ref: "#/components/schemas/UID",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          204: {
            description: "No matches, wrong UID or missing ID's in WeeklyMenu",
          },
          400: {
            description: "Bad request",
          },
        },
      },
    },
  },
};
