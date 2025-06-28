1. **Create Wiki:**

```bash
curl -X POST http://localhost:8002/api/wikis \
  -H "Content-Type: application/json" \
  -H "Authorization:${BEARER_TOKEN}" \
  -d '{"title":"YourTitle","description":"YourDescription","sidebar":{"data":[{"slug":"home", "label":"Home"}]}}'
```

2. **Get Wiki:**

```bash
curl -X GET http://localhost:8002/api/wikis/1f6e85ed-2d76-4add-9957-77154dda3419 \
  -H "Authorization:${BEARER_TOKEN}" \
  -H "Content-Type: application/json"
```

Replace `{wiki_id}` with the actual Wiki ID.

3. **Update Wiki:**

```bash
curl -X PATCH http://localhost:8000/api/wikis/{wiki_id} \
  -H "Content-Type: application/json" \
  -d '{"title":"UpdatedTitle","description":"UpdatedDescription","sidebar":{"updatedKey":"updatedValue"}}'
```

Replace `{wiki_id}` with the actual Wiki ID.

4. **Delete Wiki:**

```bash
curl -X DELETE http://localhost:8000/api/wikis/{wiki_id} \
  -H "Content-Type: application/json"
```

Replace `{wiki_id}` with the actual Wiki ID.

Make sure to replace placeholders like `{wiki_id}`, `"YourTitle"`, `"YourDescription"`, `"key"`, `"value"`, `"UpdatedTitle"`, `"UpdatedDescription"`, `"updatedKey"`, `"updatedValue"` with your actual data.
