# todoRaect-api

POST で送信

```
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"id":"todo-0004","title":"APIからTodoを追加するテスト","author":"kyary","date":"2025-10-26"}'
```

一覧取得

```
curl http://localhost:3000/todos -v
```

TODO 雛形

```
{
  "todoDate": "20251102",
  "id": "001",
  "title": "test",
  "author": "takumi"
}
```
