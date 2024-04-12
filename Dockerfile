FROM golang:1.21.1-alpine as base
RUN apk add curl bash nodejs npm make

WORKDIR /go/src/app
COPY go.* .
RUN go mod download

COPY . .
RUN make build TARGET_DIR=/go/bin/app

FROM alpine:3.17.2
COPY --from=base /go/bin/app /app
ENV PORT=8080

EXPOSE 8080

CMD ["/app"]