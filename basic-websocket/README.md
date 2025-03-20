# Websockets with Rust

## Install websocat

```bash
cargo install --features=ssl websocat
```

## Use Websocket

- Start a client:

```bash
websocat -s 8080
```

- Start a second client:

```bash
websocat ws://127.0.0.1:8080
```

## Install miniserve

```bash
cargo install miniserve
```

## Run miniserve

```bash
miniserve --port 8000 .
```

## Websocket Chat Test

### Setup

```bash
# Server (Terminal 1)
websocat -s 8080

# Client (Terminal 2)
websocat ws://127.0.0.1:8080

# Web Client
miniserve --port 8000 .
```
