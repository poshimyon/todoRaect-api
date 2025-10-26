import { Request, Response } from "express";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../client.js";

const TABLE_NAME = "Todos";

// Todo一覧取得
export const getTodos = async (_req: Request, res: Response) => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(result.Items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch todos", error: err });
  }
};

// Todo追加
export const addTodo = async (req: Request, res: Response) => {
  const { id, title, author, date } = req.body;

  if (!id || !title || !author || !date) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { id, title, author, date },
      })
    );
    res.json({ message: "Added" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add todo", error: err });
  }
};
