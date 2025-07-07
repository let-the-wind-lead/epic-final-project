#!/bin/bash
set -e

# Install AWS CLI if not already installed
snap install aws-cli --classic || true

# Authenticate Docker with AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 260073348817.dkr.ecr.us-east-1.amazonaws.com

# Navigate to project directory
cd /opt/deployment

# Start containers in detached mode
docker compose up -d

# Get the container ID for the nginx service
NGINX_CONTAINER_ID=$(docker compose ps -q nginx)

# Reload nginx if it's already running
if [ -n "$NGINX_CONTAINER_ID" ]; then
  docker exec "$NGINX_CONTAINER_ID" nginx -s reload || true
fi
