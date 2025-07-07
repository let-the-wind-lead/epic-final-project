#!/bin/bash
set -e
cd /opt/deployment
# Run docker compose down, ignore errors if not running
docker compose down || true
