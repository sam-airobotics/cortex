#!/bin/bash

cd "$(dirname "$0")"

PORT=8080

echo "Starting CURA Dashboard..."
echo "Directory: $(pwd)"
echo "URL: http://localhost:$PORT"

python3 -m http.server "$PORT" &
SERVER_PID=$!

# Make sure the server is stopped when the launcher exits
trap 'kill $SERVER_PID 2>/dev/null' EXIT

sleep 2

echo "Launching Brave..."

/snap/bin/brave --new-window --kiosk "http://localhost:$PORT" &

# Keep the launcher alive so the HTTP server stays running
wait $SERVER_PID
