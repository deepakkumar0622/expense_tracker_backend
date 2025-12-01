import { sql } from "../config/db.js";

export async function getTransactions(req, res) {
  const { user_id } = req.params;
  try {
    const result =
      await sql`SELECT * FROM transactions WHERE user_id=${user_id} ORDER BY created_at DESC`;

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTransactions(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category}) 
        RETURNING *
        `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransactions(req, res) {
  const { id } = req.params;
  try {
    if (isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result =
      await sql`DELETE FROM transactions WHERE id=${id} RETURNING * `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction Not Found" });
    }

    res.status(200).json({ message: "Transaction Deleted successfully!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSummary(req, res) {
  try {
    const { userId } = req.params;

    const balance = await sql`
        SELECT COALESCE(sum(amount),0) as balance FROM transactions WHERE user_id=${userId}`;

    const income = await sql`
        SELECT COALESCE(sum(amount),0) as income FROM transactions WHERE user_id=${userId} AND amount > 0`;

    const expense = await sql`
        SELECT COALESCE(sum(amount),0) as expenses FROM transactions WHERE user_id=${userId} AND amount < 0`;

    res.status(200).json({
      balance: balance[0].balance,
      income: income[0].income,
      expense: expense[0].expenses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
