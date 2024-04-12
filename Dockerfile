FROM node:lts-alpine3.19 as ui-builder

WORKDIR /app

COPY . .

RUN cd ui && npm install --legacy-peer-deps && npm run build

FROM golang:1.21.1-alpine as base

WORKDIR /go/src/app

COPY --from=ui-builder /app/* .

RUN go mod download
RUN go generate ./...
RUN CGO_ENABLED=0 go build -o /go/bin/app -buildvcs=false

FROM alpine:3.17.2
COPY --from=base /go/bin/app /app
ENV PORT=8080

EXPOSE 8080

CMD ["/app"]