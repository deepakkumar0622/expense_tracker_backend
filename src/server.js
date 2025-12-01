import express from "express";
import dotenv from "dotenv";
import { initBD } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiting.js";
import transactions from "./routes/transactions.js";
import job from "./config/cron.js";

// To get the env objects
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// for scheduling job & for production only
if (process.env.NODE_ENV === "production") job.start();
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//To accept the json req/res body
app.use(express.json());

// Middleware
app.use(ratelimiter);

// Routes
app.use("/api/transactions", transactions);

initBD().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running in port", PORT);
  });
});
