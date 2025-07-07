#!/bin/bash
set -e
cd /home/ubuntu/epic-final-project
# Run docker compose down, ignore errors if not running
docker-compose down || true
