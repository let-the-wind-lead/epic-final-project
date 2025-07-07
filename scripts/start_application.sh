#!/bin/bash
set -e

# Install AWS CLI if not already installed (can be skipped if AMI has it preinstalled)
snap install aws-cli --classic

# Authenticate Docker with AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-ecr-repo>.dkr.ecr.us-east-1.amazonaws.com

# Go to your app's directory
cd /home/ubuntu/epic-final-project

# Start containers
docker compose up -d

# Reload nginx if running
NGINX_CONTAINER_ID=$(docker compose ps -q nginx)
if [ -n "$NGINX_CONTAINER_ID" ]; then
  docker exec "$NGINX_CONTAINER_ID" nginx -s reload || true
fi
