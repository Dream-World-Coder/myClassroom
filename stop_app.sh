#!/bin/bash

echo "Stopping React Frontend..."
kill $(cat ~/react.pid)
rm ~/react.pid

echo "Stopping Flask Server..."
kill $(cat ~/flask.pid)
rm ~/flask.pid

echo "Stopping MongoDB..."
brew services stop mongodb-community
sleep 2

echo "All services stopped."
