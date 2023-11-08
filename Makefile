.PHONY: build
TARGET_DIR ?= build/app
build: 
	(set -e; cd ui && pnpm i && pnpm run build)
	go generate ./...
	CGO_ENABLED=0 go build -o ${TARGET_DIR} -buildvcs=false

start-ui-dev:
	cd ui && npm run dev

dev:
	# npx tsx cli/nodejs/analysis-rss.ts
	# go run cli/scraper/producthunt.go
	@source .env && npx concurrently "cd ui && npm run dev" "go run main.go"

start:
	docker compose up -d

start-clean:
	docker compose up --force-recreate --build app

deploy:
	flyctl deploy