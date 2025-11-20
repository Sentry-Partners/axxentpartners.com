#!/usr/bin/env bash
# dev.sh — simple reloadable static host

PORT=5173
HOST="0.0.0.0"
DIR="${1:-.}"

echo "▶ Serving $DIR on http://$HOST:$PORT"
npx --yes live-server "$DIR" --host="$HOST" --port="$PORT" --wait=100
