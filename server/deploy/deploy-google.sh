#!/bin/bash

# Google Cloud Deployment Script for Foodism API
# Usage: ./deploy-google.sh [environment]

ENVIRONMENT=${1:-production}
PROJECT_ID=${GOOGLE_CLOUD_PROJECT_ID}
REGION=${GOOGLE_CLOUD_REGION:-us-central1}

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Error: GOOGLE_CLOUD_PROJECT_ID not set"
  exit 1
fi

echo "🚀 Deploying Foodism API to Google Cloud ($ENVIRONMENT)..."

# Build and submit to Container Registry
echo "📦 Building and pushing image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/foodism-api:$ENVIRONMENT

# Deploy to Cloud Run
echo "🚢 Deploying to Cloud Run..."
gcloud run deploy foodism-api \
  --image gcr.io/$PROJECT_ID/foodism-api:$ENVIRONMENT \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=$ENVIRONMENT

echo "✅ Deployment complete!"
echo "📍 Service URL: $(gcloud run services describe foodism-api --region $REGION --format 'value(status.url)')"

