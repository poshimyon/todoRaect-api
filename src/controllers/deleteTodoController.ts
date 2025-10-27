import { Request, Response } from "express";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../client.js";

const TABLE_NAME = "Todos";

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    await ddb.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete todo", error: err });
  }
};
