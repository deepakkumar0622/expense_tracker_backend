import express from "express";
import dotenv from "dotenv";
import { initBD } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiting.js";
import transactions from "./routes/transactions.js";

// To get the env objects
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//To accept the json req/res body
app.use(express.json());

// Middle ware
app.use(ratelimiter);

// Routes
app.use("/api/transactions", transactions);

initBD().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running in port", PORT);
  });
});
