# todoRaect-api
GETで取得
```
curl -X GET http://localhost:3000/todos
```

PUTで更新
```
curl -X PUT http://localhost:3000/todos/3 -H "Content-Type: application/json" -d '{"title":"item3","author":"takumi","todoDate":"10-28"}'
```
DELETEで削除
```
curl -X DELETE http://localhost:3000/todos/3
```

POST で送信

```
curl -X POST http://localhost:3000/todos \
> -H "Content-Type: application/json" \
> -d '{"id": "2","title":"item2","author":"takumi","date":"10-28"}'
```

一覧取得

```
curl http://localhost:3000/todos -v
```
