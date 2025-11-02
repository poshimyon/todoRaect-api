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
    const result = await ddb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression:
          "SET title = :title, author = :author, todoDate = :todoDate",
        ExpressionAttributeValues: {
          ":title": title,
          ":author": author,
          ":todoDate": todoDate,
        },
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "ALL_NEW",
      })
    );

    if (!result.Attributes) {
      return res
        .status(500)
        .json({ message: "Failed to fetch updated todo item" });
    }

    res.json(result.Attributes);
  } catch (err) {
    console.error("❌ Update error:", err);

    if (
      typeof err === "object" &&
      err !== null &&
      "name" in err &&
      err.name === "ConditionalCheckFailedException"
    ) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(500).json({ message: "Failed to update todo" });
  }
};
