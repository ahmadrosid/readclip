.PHONY: build
TARGET_DIR ?= build/app
build: build-ui
	go generate ./...
	CGO_ENABLED=0 go build -o ${TARGET_DIR} -buildvcs=false

start-ui-dev:
	cd ui && npm run dev

build-ui:
	(set -e; cd ui && npm install --legacy-peer-deps && npm run build)

dev:
	@source .env && bun --filter "ui" --filter "go run main.go"

start:
	docker compose up -d

start-clean:
	docker compose up --force-recreate --build app

deploy:
	ssh root@api.ahmadrosid.com "cd /root/readclip/ && ./deploy.sh"