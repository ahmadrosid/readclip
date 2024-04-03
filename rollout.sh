#!/bin/bash
set -e

# Generate a timestamp-based version tag
VERSION_TAG=$(git rev-parse --short HEAD)
PREVIOUS_VERSION_TAG=$(git rev-parse --short HEAD~1)

# Build the Docker image with the new version tag
docker build -t readclip:$VERSION_TAG .

# Stop and remove the existing container, if any
if [ "$(docker ps -aq --filter "ancestor=readclip")" ]; then
    docker stop $(docker ps -aq --filter "ancestor=readclip")
    docker rm $(docker ps -aq --filter "ancestor=readclip")
fi

# Tag the latest build as "latest" for reference
docker tag readclip:$VERSION_TAG readclip:latest

# Run the Docker container with the new version
docker run -d -p 8000:8000 --env-file=/root/readclip/.env -e "IMAGE_TAG=$VERSION_TAG" readclip:$VERSION_TAG

# Remove image from local registry
echo "Removing readclip:$PREVIOUS_VERSION_TAG";
docker rmi -f readclip:$PREVIOUS_VERSION_TAG

echo "Rollout deployment done for version $VERSION_TAG"
