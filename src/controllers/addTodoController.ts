import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../client.js";

const TABLE_NAME = "Todos";

export const addTodo = async (req: Request, res: Response) => {
  const { id: rawId, title, author, todoDate } = req.body;

  if (!title || !author || !todoDate) {
    return res.status(400).json({ message: "All fields required" });
  }

  const id =
    typeof rawId === "string" && rawId.trim().length > 0 ? rawId : randomUUID();
  const item = { id, title, author, todoDate };

  try {
    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: "attribute_not_exists(id)",
      })
    );
    res.status(201).json(item);
  } catch (err) {
    console.error("❌ Add todo error:", err);

    if (
      typeof err === "object" &&
      err !== null &&
      "name" in err &&
      err.name === "ConditionalCheckFailedException"
    ) {
      return res.status(409).json({ message: "Todo already exists" });
    }

    res.status(500).json({ message: "Failed to add todo" });
  }
};
