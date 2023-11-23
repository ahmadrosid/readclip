1. **Create Wiki:**

```bash
curl -X POST http://localhost:8002/api/wikis \
  -H "Content-Type: application/json" \
  -H "Authorization:eyJhbGciOiJSUzI1NiIsImtpZCI6ImE2YzYzNTNmMmEzZWMxMjg2NTA1MzBkMTVmNmM0Y2Y0NTcxYTQ1NTciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQWhtYWQgUm9zaWQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0ZWxheDNWVEZnQ3NLODRKbXZrX3lYV3JyRVNXbTVXcm1RVUphaF82WllaZjQycT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZWFkY2xpcC1hdXRoIiwiYXVkIjoicmVhZGNsaXAtYXV0aCIsImF1dGhfdGltZSI6MTcwMDA2Mjc5NywidXNlcl9pZCI6Ilo4blREekZBQXBXSUphQksxeVRxbnU0eVV3SDIiLCJzdWIiOiJaOG5URHpGQUFwV0lKYUJLMXlUcW51NHlVd0gyIiwiaWF0IjoxNzAwNzU3MTI5LCJleHAiOjE3MDA3NjA3MjksImVtYWlsIjoiYWxhaG1hZHJvc2lkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTEzMjg0MTcyNDYyMjI3MTgxMDkxIl0sImVtYWlsIjpbImFsYWhtYWRyb3NpZEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.vKRW0nyb6wbRIl4j74qRx_FGfXAJ5o3eFII5NKlZT15T8Z-Xx0zzmXZk7dTixWTsr5YYrW3vg0Ni4_gYo4A6sQUKxdgviL1iuoUzDtKYZO1Oza6en6J64KuZKdsBB1svLKvqStQUdVW94eusJ6cNaQ5TdoauXt6Z_eVJ9tBUyVwM_5RNV5WeFxEF8-UhXFK7wimBej4khmAT3MsRLjCrYEKkG_2lPtJd-51CaeVWIDoNrjM1F9_L-w8yKoo78066_h4cNeBxngKit9aJLQ6b3mmBeemXHHXB-nmB1vQomB1ojbRN0Wapc5MIDa6s_dPyza7yk5I9LbGLPTyMlR1zbw" \
  -d '{"title":"YourTitle","description":"YourDescription","sidebar":{"data":[{"slug":"home", "label":"Home"}]}}'
```

2. **Get Wiki:**

```bash
curl http://localhost:8000/api/wikis/{wiki_id} \
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