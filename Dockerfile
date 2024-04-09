FROM oven/bun as ui-builder
WORKDIR /app

COPY ./ui/* .

RUN bun install --production
RUN ls -l node_modules/.bin
RUN bun run build

FROM golang:1.21.1-alpine as base
RUN apk add curl bash make

WORKDIR /go/src/app
COPY go.* .
RUN go mod download

COPY . .
COPY --from=ui-builder /app/dist ./ui
RUN go generate ./...
RUN CGO_ENABLED=0 go build -o /go/bin/app -buildvcs=false

FROM alpine:3.17.2
COPY --from=base /go/bin/app /app
ENV PORT=8080

EXPOSE 8080

CMD ["/app"]