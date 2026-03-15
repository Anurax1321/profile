#!/bin/bash
cd "$(dirname "$0")"

LOG_FILE="./dev.log"
PID_FILE="./dev.pid"

# Check if already running
if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Already running (PID $(cat "$PID_FILE")). Stop it first with: kill $(cat "$PID_FILE")"
  exit 1
fi

# Check node/npm available
if ! command -v npm &>/dev/null; then
  echo "ERROR: npm not found. Install Node.js first."
  exit 1
fi

# Install dependencies if missing
if [ ! -d "node_modules" ]; then
  echo "node_modules not found, running npm install..."
  npm install || { echo "ERROR: npm install failed"; exit 1; }
fi

export PATH="$(pwd)/node_modules/.bin:$PATH"

# Clear old logs
rm -f "$LOG_FILE"

echo "Starting dev server on port 8889 in background..."
nohup npm run dev -- --host > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

# Wait and verify it actually started
sleep 3
if ! kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "ERROR: Server failed to start. Logs:"
  cat "$LOG_FILE"
  rm -f "$PID_FILE"
  exit 1
fi

if ss -tlnp 2>/dev/null | grep -q 8889; then
  echo "Server running on port 8889 (PID $(cat "$PID_FILE"))"
else
  echo "WARNING: Process started but port 8889 not yet listening. Check logs: $LOG_FILE"
fi

echo "Stop with: kill \$(cat $PID_FILE)"
