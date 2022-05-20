# API for Foodomatic

Documentation for the API with examples can be found at:
* Local: http://localhost:6060/api-docs
* Development: https://dev-foodomatic-api.herokuapp.com/api-docs
* Production: https://foodomatic-api.herokuapp.com/api-docs
## Files

### source/server.ts

This is the main program file. It includes the runtime of the server and binds the rest of the project together. For example the different routes and the logic.

### source/controllers/inventory.ts

This file contains the entire logic for the API for inventory calls and controlls the different actions. New features would be written in this file.

### source/controllers/user.ts

This file contains the entire logic for the API for user calls and controlls the different actions.
New features would be written in this file.

### source/controllers/shoppingList.ts

This file contains the entire logic for the API for shopping list calls and controlls the different actions.
New features would be written in this file.

### source/routes/inventoryRequests.ts

This files defines the URL requests for inventory, what they have to include and where they should go.

### source/routes/userRequests.ts

This file defines the URL requests for users, what they have to include and where they should go.

### source/routes/shoppingListsRequests.ts

This file defines the URL requests for shopping lists, what they have to include and where they should go.

### source/services/dbConnection.ts

This files initates and dictates the connection to the database and keeps it open.

### .env

This files containes the enviromental variables for the project.

### Procfile

This file contains npm scripts.