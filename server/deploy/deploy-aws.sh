#!/bin/bash

# AWS Deployment Script for Foodism API
# Usage: ./deploy-aws.sh [environment]

ENVIRONMENT=${1:-production}
REGION=${AWS_REGION:-us-east-1}

echo "🚀 Deploying Foodism API to AWS ($ENVIRONMENT)..."

# Build Docker image
echo "📦 Building Docker image..."
docker build -t foodism-api:latest .

# Tag for ECR
ECR_REPO="foodism-api"
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO}"

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI

# Push image
echo "⬆️  Pushing image to ECR..."
docker tag foodism-api:latest $ECR_URI:latest
docker tag foodism-api:latest $ECR_URI:$ENVIRONMENT
docker push $ECR_URI:latest
docker push $ECR_URI:$ENVIRONMENT

# Deploy to ECS
echo "🚢 Deploying to ECS..."
aws ecs update-service \
  --cluster foodism-api-cluster \
  --service foodism-api-service \
  --force-new-deployment \
  --region $REGION

echo "✅ Deployment complete!"

