## DynamoDB Local トラブルシュート記録

日付: 2025-10-27

### 概要

-   発生症状:
    -   API 側で `TypeError: Converting circular structure to JSON` が発生
    -   GUI (dynamodb-admin) では `Unexpected token '<'` が表示される
-   原因 (判明したこと):
    -   DynamoDB Local（内部で SQLite を使用）がデータファイルを開けず書き込みに失敗していた（`unable to open database file` / `attempt to write a readonly database`）。
    -   その結果 Put 操作が失敗 → エラーオブジェクトが発生 → 3rd-party がそのエラーをそのまま `res.json()` で返したため循環参照の JSON 化で例外が発生した。

### 対処概要

1. アプリ側の堅牢化

    - `src/middlewares/errorHandler.ts` を修正して、生の Error / req / res オブジェクトをそのまま返さないようにした（message と開発時は stack のみ返す）。
    - `src/controllers/todosController.ts` の catch で `res.json(err)` を避け、シリアライズ可能なフィールドのみを返すように変更。

2. DynamoDB Local の復旧
    - `docker-compose.yml` の bind-mount (`./dynamodb-data:/home/dynamodblocal/data`) を Docker named volume (`dynamodb-data:/home/dynamodblocal/data`) に変更して、ホスト側の権限問題を回避した。
    - ボリューム内の破損ファイル（例: `shared-local-instance.db`）をバックアップまたは削除して再生成させた。
    - 必要に応じてボリュームの所有者を DynamoDB の実行ユーザ（UID 1000）に変更 (`chown -R 1000:1000`) して書き込み権限を回復。

### 再発原因（技術的に噛み砕いて）

-   macOS でホストのディレクトリをコンテナに bind-mount した場合、ホスト側のファイル所有者や Docker Desktop の共有設定により、コンテナ内のプロセスがファイルを書き込めないことがある。
-   DynamoDB Local は内部で SQLite を使いファイルへ書き込むため、ファイルが書き込み不可だと DB 操作が失敗する。

### 実行したコマンド（参考）

```bash
# コンテナのログ確認
docker logs dynamodb-local --tail 200

# named volume の中身確認
docker run --rm -v todoreact-api_dynamodb-data:/data alpine ls -la /data

# DB の削除
docker run --rm -v todoreact-api_dynamodb-data:/data alpine rm -f /data/shared-local-instance.db || true

# 所有者変更（dynamodb の実行ユーザ UID 1000 に合わせる）
docker run --rm -v todoreact-api_dynamodb-data:/data alpine chown -R 1000:1000 /data

# 再起動
docker-compose down
docker-compose up -d
docker logs dynamodb-local --tail 200
```

### 再発防止と推奨事項

-   開発環境では named volume を使うか、永続化不要であれば `-inMemory` オプションで起動する。これでホストのファイル権限問題を回避できる。
-   サーバー側はエラーをクライアントへそのまま返さない（message と必要最小限の情報のみ）設計にする。
-   トラブル発生時はまず `docker logs` とボリュームの中身を確認する。
