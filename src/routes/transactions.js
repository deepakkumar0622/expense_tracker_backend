import express from "express";
import {
  createTransactions,
  deleteTransactions,
  getSummary,
  getTransactions,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransactions);

router.get("/:user_id", getTransactions);

router.delete("/:id", deleteTransactions);

router.get("/summary/:userId", getSummary);

export default router;
