import { Request, Response } from "express";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../client.js";

const TABLE_NAME = "Todos";

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author, todoDate } = req.body;

  if (!id || !title || !author || !todoDate) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: "SET title = :title, author = :author, todoDate = :todoDate",
        ExpressionAttributeValues: {
          ":title": title,
          ":author": author,
          ":todoDate": todoDate,
        },
        ReturnValues: "UPDATED_NEW", // ← これを追加
      })
    );
    res.json({ message: "Updated" });
  } catch (err) {
    console.error("❌ Update error:", err); // ← ログ出力も追加
    res.status(500).json({ message: "Failed to update todo", error: err });
  }
};
