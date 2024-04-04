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
docker run -d -p 8000:8000 --env-file=/root/readclip/.env ghcr.io/ahmadrosid/readclip:latest
```

## VPS

```bash
scp $(pwd)/.env root@api.ahmadrosid.com:/root/readclip/.env

ssh root@api.ahmadrosid.com "cd /root/readclip/ && git pull origin main"
ssh root@api.ahmadrosid.com "cd /root/readclip/ && ./deploy.sh"
ssh root@api.ahmadrosid.com 'docker ps -aq --filter "ancestor=ghcr.io/ahmadrosid/readclip"'

ssh root@api.ahmadrosid.com "docker run -d -p 8000:8000 --env-file=/root/readclip/.env ghcr.io/ahmadrosid/readclip:latest"
ssh root@api.ahmadrosid.com "cd /root/readclip && git pull origin main"
ssh root@api.ahmadrosid.com "cd /root/readclip && ./rollout.sh"
ssh root@api.ahmadrosid.com "cd /root/readclip && docker compose build"
ssh root@api.ahmadrosid.com "cd /root/readclip && docker compose up -d"
ssh root@api.ahmadrosid.com "docker images"
ssh root@api.ahmadrosid.com "docker ps"
ssh root@api.ahmadrosid.com "docker kill 6a14baf2b750"
ssh root@api.ahmadrosid.com "docker rmi d5442cda1d5a -f"
ssh root@api.ahmadrosid.com "sudo systemctl restart nginx"

scp $(pwd)/readclip.site.conf root@api.ahmadrosid.com:/etc/nginx/sites-enabled/readclip.site.conf
scp $(pwd)/readclip.site.conf root@api.ahmadrosid.com:/etc/nginx/sites-available/readclip.site.conf

ssh root@api.ahmadrosid.com "rm /etc/nginx/sites-enabled/readclip.site.conf"
ssh root@api.ahmadrosid.com "rm /etc/nginx/sites-available/readclip.site.conf"
```

Backup db:

```bash
pg_dump -U alahmadrosid -d neondb -h ep-nameless-shape-59949167.ap-southeast-1.aws.neon.tech -p 5432 > readclip.sql
```

Restore db:

```bash
pg_restore -h ep-ancient-mode-a1fbkbqv.ap-southeast-1.aws.neon.tech -p 5432 -U alahmadrosid -d neondb readclip.sql
```
