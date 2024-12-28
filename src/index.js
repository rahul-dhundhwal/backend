// require('dotenv').config({path:`./env`})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";



dotenv.config({
    path:'./env'
})



connectDB()
  .then(() => {
    // Start the server if the database connection is successful
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    // Log the error in detail
    console.error("Connection Error: ", err.message || err);
    process.exit(1); // Exit the process with a failure code
  });
