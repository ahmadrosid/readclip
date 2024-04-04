## Fly.io CI

Deploy to fly io ci.

```yml
name: Fly Deploy
on:
  push:
    branches:
      - main
jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## Run docker

```bash
docker run -d -p 7000:8000 --env-file=.env readclip:latest
```

## VPS

```bash
scp $(pwd)/.env root@api.ahmadrosid.com:/root/readclip/.env

ssh root@api.ahmadrosid.com "cd /root/readclip && git pull origin main"
ssh root@api.ahmadrosid.com "cd /root/readclip && ./rollout.sh"
ssh root@api.ahmadrosid.com "cd /root/readclip && docker compose build"
ssh root@api.ahmadrosid.com "cd /root/readclip && docker compose up -d"
ssh root@api.ahmadrosid.com "docker images"
ssh root@api.ahmadrosid.com "docker rmi e00b5b29b462"
ssh root@api.ahmadrosid.com "sudo systemctl restart nginx"
```

