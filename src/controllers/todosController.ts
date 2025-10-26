import { Request, Response } from "express";
import { ddb } from "../client.js";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "Todos";

export const getTodos = async (_req: Request, res: Response) => {
    const result = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(result.Items ?? []);
};

export const addTodo = async (req: Request, res: Response) => {
    const { id, title } = req.body;
    if (!id || !title)
        return res.status(400).json({ message: "id and title required" });

    await ddb.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: { id, title },
        })
    );
    res.json({ message: "Added" });
};
