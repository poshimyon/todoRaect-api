import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "ap-northeast-1",
    endpoint: "http://localhost:8000",
});

export const ddb = DynamoDBDocumentClient.from(client);
