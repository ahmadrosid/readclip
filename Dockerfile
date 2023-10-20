FROM golang:1.20.1-alpine as base
RUN apk add --no-cache curl

# we need Node >= 16.12.0 and yarn to build the Astro UI
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get update && \
  apt-get install -y nodejs && \
  npm install --global pnpm

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