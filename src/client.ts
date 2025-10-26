import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "local", // 👈 ← これが重要（または削除でもOK）
    endpoint:
        process.platform === "win32"
            ? "http://host.docker.internal:8000"
            : "http://localhost:8000",
    credentials: {
        accessKeyId: "fakeMyKeyId",
        secretAccessKey: "fakeSecretAccessKey",
    },
});

export const ddb = DynamoDBDocumentClient.from(client);
