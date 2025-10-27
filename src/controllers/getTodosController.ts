import { Request, Response } from "express";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../client.js";

const TABLE_NAME = "Todos";

export const getTodos = async (_req: Request, res: Response) => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(result.Items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch todos", error: err });
  }
};
