#!/bin/bash

echo "Starting MongoDB..."
brew services start mongodb-community
sleep 2

echo "Starting Flask Server..."
cd server
source .venv/bin/activate
sleep 2
python run.py &
FLASK_PID=$!
cd ..

echo "Starting React Frontend..."
cd client
pnpm dev &
REACT_PID=$!
cd ..

echo "All services started."
echo $FLASK_PID > ~/flask.pid
echo $REACT_PID > ~/react.pid
