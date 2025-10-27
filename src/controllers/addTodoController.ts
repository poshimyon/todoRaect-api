import { Request, Response } from "express";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../client.js";

const TABLE_NAME = "Todos";

export const addTodo = async (req: Request, res: Response) => {
  const { id, title, author, todoDate } = req.body;

  if (!id || !title || !author || !todoDate) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { id, title, author, todoDate },
      })
    );
    res.json({ message: "Added" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add todo", error: err });
  }
};
