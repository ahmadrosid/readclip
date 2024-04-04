#!/bin/bash

echo "Start redeploying..."

# Stop and remove the existing container, if any
if [ "$(docker ps -aq --filter "ancestor=ghcr.io/ahmadrosid/readclip")" ]; then
    docker stop $(docker ps -aq --filter "ancestor=ghcr.io/ahmadrosid/readclip")
    docker rm $(docker ps -aq --filter "ancestor=ghcr.io/ahmadrosid/readclip")
fi

# Remove image from local registry
echo "Removing ghcr.io/ahmadrosid/readclip:latest";
docker rmi -f ghcr.io/ahmadrosid/readclip:latest

docker compose up -f /root/readclip/docker-compose.yml -d

echo "Rollout deployment done for version $VERSION_TAG"
