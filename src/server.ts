import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { ddb } from "./client.js";
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use(errorHandler);

// DynamoDB Local テーブル作成
async function ensureTable() {
    try {
        await ddb.send(
            new CreateTableCommand({
                TableName: "Todos",
                AttributeDefinitions: [
                    { AttributeName: "id", AttributeType: "S" },
                ],
                KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                },
            })
        );
        console.log("✅ Created table 'Todos'");
    } catch (err: any) {
        if (err.name === "ResourceInUseException") {
            console.log("ℹ️ Table already exists");
        } else console.error("❌ Failed to create table:", err);
    }
}
ensureTable();

app.listen(3000, () => console.log("🚀 API running on http://localhost:3000"));
