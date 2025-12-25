# Step-by-Step Google Cloud Deployment Guide 🚀

Complete guide to deploy Foodism CA API to Google Cloud Platform.

## Prerequisites

- Google Cloud Account (free trial available)
- Google Cloud SDK (gcloud) installed
- Node.js 18+ installed locally
- Billing enabled on GCP project

## Step 1: Install and Configure Google Cloud SDK

### Install gcloud CLI

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Or download from:**
https://cloud.google.com/sdk/docs/install

### Initialize and Authenticate

```bash
# Login
gcloud auth login

# Create new project (or use existing)
gcloud projects create foodism-api --name="Foodism API"

# Set current project
gcloud config set project foodism-api

# Enable billing (required for Cloud SQL)
# Go to: https://console.cloud.google.com/billing

# Enable required APIs
gcloud services enable \
  compute.googleapis.com \
  sqladmin.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  vpcaccess.googleapis.com
```

---

## Step 2: Create Cloud SQL PostgreSQL Database

### 2.1 Create Cloud SQL Instance

```bash
gcloud sql instances create foodism-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password='YourSecurePassword123!' \
  --storage-type=SSD \
  --storage-size=20GB \
  --storage-auto-increase \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --database-flags=max_connections=100
```

**Wait for instance to be ready (5-10 minutes):**
```bash
gcloud sql instances describe foodism-db
```

### 2.2 Create Database

```bash
gcloud sql databases create foodism_db \
  --instance=foodism-db
```

### 2.3 Create Database User

```bash
gcloud sql users create foodism_user \
  --instance=foodism-db \
  --password='YourSecurePassword123!'
```

### 2.4 Get Database Connection Name

```bash
CONNECTION_NAME=$(gcloud sql instances describe foodism-db \
  --format='value(connectionName)')

echo "Connection Name: $CONNECTION_NAME"
```

### 2.5 Configure Authorized Networks (for local access)

```bash
# Get your public IP
YOUR_IP=$(curl -s https://checkip.amazonaws.com)

# Add to authorized networks
gcloud sql instances patch foodism-db \
  --authorized-networks=$YOUR_IP/32
```

---

## Step 3: Set Up VPC and Firewall Rules

### 3.1 Create VPC Connector (for Cloud Run)

```bash
gcloud compute networks vpc-access connectors create foodism-connector \
  --region=us-central1 \
  --subnet-project=foodism-api \
  --subnet=default \
  --min-instances=2 \
  --max-instances=3
```

### 3.2 Create Firewall Rule for API

```bash
gcloud compute firewall-rules create foodism-api-allow-http \
  --allow tcp:80,tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --target-tags foodism-api \
  --description "Allow HTTP/HTTPS traffic to Foodism API"
```

### 3.3 Allow Cloud Run to Access Cloud SQL

```bash
# Get Cloud Run service account
SERVICE_ACCOUNT=$(gcloud projects describe foodism-api \
  --format='value(projectNumber)')-compute@developer.gserviceaccount.com

# Grant Cloud SQL Client role
gcloud projects add-iam-policy-binding foodism-api \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/cloudsql.client"
```

---

## Step 4: Deploy to Cloud Run (Recommended)

### 4.1 Build and Push Docker Image

```bash
cd server

# Configure Docker to use gcloud
gcloud auth configure-docker

# Set project ID
export PROJECT_ID=$(gcloud config get-value project)
export REGION=us-central1

# Build image
gcloud builds submit --tag gcr.io/$PROJECT_ID/foodism-api:latest
```

### 4.2 Deploy to Cloud Run

```bash
# Get connection name
CONNECTION_NAME=$(gcloud sql instances describe foodism-db \
  --format='value(connectionName)')

# Deploy
gcloud run deploy foodism-api \
  --image gcr.io/$PROJECT_ID/foodism-api:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances=$CONNECTION_NAME \
  --set-env-vars="NODE_ENV=production,DB_TYPE=postgresql,DB_NAME=foodism_db,DB_USER=foodism_user,DB_PASSWORD=YourSecurePassword123!,DB_HOST=/cloudsql/$CONNECTION_NAME" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --timeout 300
```

**Get service URL:**
```bash
SERVICE_URL=$(gcloud run services describe foodism-api \
  --region $REGION \
  --format 'value(status.url)')

echo "Service URL: $SERVICE_URL"
```

### 4.3 Run Database Migrations

```bash
# Get Cloud SQL Proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.darwin.arm64
chmod +x cloud-sql-proxy

# Start proxy in background
./cloud-sql-proxy $CONNECTION_NAME &

# Set environment variables for local migration
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_NAME=foodism_db
export DB_USER=foodism_user
export DB_PASSWORD='YourSecurePassword123!'
export DB_SSL=false

# Run migrations
cd server
npm install
npm run migrate
npm run seed
```

---

## Step 5: Alternative - Deploy to Compute Engine (VM)

### 5.1 Create VM Instance

```bash
gcloud compute instances create foodism-api-vm \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB \
  --tags=foodism-api \
  --metadata=startup-script='#!/bin/bash
    apt-get update
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs git postgresql-client
    npm install -g pm2
  '
```

### 5.2 SSH into VM

```bash
gcloud compute ssh foodism-api-vm --zone=us-central1-a
```

### 5.3 Set Up Application

```bash
# Clone repository
git clone YOUR_REPO_URL
cd foodism-modern-editorial/server

# Install dependencies
npm install

# Configure Cloud SQL Proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy

# Get connection name
CONNECTION_NAME=$(gcloud sql instances describe foodism-db --format='value(connectionName)')

# Start proxy
./cloud-sql-proxy $CONNECTION_NAME &

# Create .env file
cat > .env << EOF
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

DB_TYPE=postgresql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=foodism_db
DB_USER=foodism_user
DB_PASSWORD=YourSecurePassword123!
DB_SSL=false
EOF

# Run migrations
npm run migrate
npm run seed

# Start with PM2
pm2 start src/index.js --name foodism-api
pm2 save
pm2 startup
```

---

## Step 6: Set Up App Engine (Alternative)

### 6.1 Create app.yaml

Already created in `server/app.yaml`. Update with your connection name:

```bash
# Update app.yaml with connection name
CONNECTION_NAME=$(gcloud sql instances describe foodism-db \
  --format='value(connectionName)')
```

Edit `server/app.yaml`:
```yaml
runtime: nodejs18
env: standard

env_variables:
  NODE_ENV: production
  DB_TYPE: postgresql
  DB_NAME: foodism_db
  DB_USER: foodism_user
  DB_PASSWORD: 'YourSecurePassword123!'
  DB_HOST: /cloudsql/$CONNECTION_NAME
```

### 6.2 Deploy

```bash
cd server
gcloud app deploy
```

---

## Step 7: Configure Custom Domain and SSL

### 7.1 Map Custom Domain (Cloud Run)

```bash
gcloud run domain-mappings create \
  --service foodism-api \
  --domain api.yourdomain.com \
  --region us-central1
```

### 7.2 Add DNS Records

Follow the instructions provided by gcloud to add DNS records.

---

## Step 8: Set Up Monitoring and Logging

### 8.1 View Logs

```bash
# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=foodism-api" --limit 50

# Compute Engine logs
gcloud compute instances get-serial-port-output foodism-api-vm --zone us-central1-a
```

### 8.2 Create Alerting Policies

```bash
# Create uptime check
gcloud monitoring uptime create api-uptime \
  --display-name="Foodism API Uptime" \
  --http-check-path="/health" \
  --http-check-host="$SERVICE_URL"
```

---

## Step 9: Verify Deployment

### 9.1 Test Health Endpoint

```bash
curl $SERVICE_URL/health
```

### 9.2 Test API Endpoints

```bash
# Get articles
curl $SERVICE_URL/api/articles

# Get categories
curl $SERVICE_URL/api/categories
```

---

## Environment Variables Summary

### For Cloud Run:
```env
NODE_ENV=production
DB_TYPE=postgresql
DB_NAME=foodism_db
DB_USER=foodism_user
DB_PASSWORD=YourSecurePassword123!
DB_HOST=/cloudsql/PROJECT_ID:REGION:foodism-db
```

### For Compute Engine (with Cloud SQL Proxy):
```env
NODE_ENV=production
DB_TYPE=postgresql
DB_NAME=foodism_db
DB_USER=foodism_user
DB_PASSWORD=YourSecurePassword123!
DB_HOST=127.0.0.1
DB_PORT=5432
DB_SSL=false
```

---

## Troubleshooting

### Check Cloud Run logs:
```bash
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

### Test database connection:
```bash
# With Cloud SQL Proxy
psql -h 127.0.0.1 -U foodism_user -d foodism_db

# Direct connection (if authorized)
gcloud sql connect foodism-db --user=foodism_user --database=foodism_db
```

### View Cloud SQL instances:
```bash
gcloud sql instances list
gcloud sql instances describe foodism-db
```

---

## Clean Up Resources

```bash
# Delete Cloud SQL instance
gcloud sql instances delete foodism-db

# Delete Cloud Run service
gcloud run services delete foodism-api --region us-central1

# Delete Compute Engine instance
gcloud compute instances delete foodism-api-vm --zone us-central1-a

# Delete Docker images
gcloud container images delete gcr.io/$PROJECT_ID/foodism-api:latest
```

---

## Cost Optimization Tips

1. **Use Cloud Run** - Pay only for requests (cheapest option)
2. **Use db-f1-micro** for development
3. **Set min-instances=0** on Cloud Run for non-production
4. **Use preemptible VMs** for Compute Engine if needed
5. **Enable auto-scaling** to scale down during low traffic

---

## Next Steps

1. Set up CI/CD with Cloud Build
2. Configure Cloud CDN
3. Set up Cloud Armor for DDoS protection
4. Enable Cloud Monitoring alerts
5. Set up automated backups

