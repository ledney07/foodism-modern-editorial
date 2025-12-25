# Deployment Guide - Foodism CA

Complete deployment guide for AWS and Google Cloud platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Deployment](#aws-deployment)
3. [Google Cloud Deployment](#google-cloud-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)

## Prerequisites

- Node.js 18+ installed
- AWS CLI configured (for AWS deployment)
- Google Cloud SDK installed (for Google Cloud deployment)
- Docker installed (optional, for containerized deployments)

## AWS Deployment

### Option 1: AWS Elastic Beanstalk (Recommended for Quick Start)

1. **Install EB CLI:**
```bash
pip install awsebcli
```

2. **Initialize Elastic Beanstalk:**
```bash
cd server
eb init -p node.js foodism-api
```

3. **Create and deploy:**
```bash
eb create foodism-api-prod
eb deploy
```

4. **Set environment variables:**
```bash
eb setenv DB_HOST=your-rds-endpoint DB_PASSWORD=your-password
```

### Option 2: AWS ECS with Fargate

1. **Build and push Docker image:**
```bash
cd server
docker build -t foodism-api .
docker tag foodism-api:latest YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/foodism-api:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/foodism-api:latest
```

2. **Use CloudFormation template:**
```bash
cd deploy
aws cloudformation create-stack \
  --stack-name foodism-infrastructure \
  --template-body file://aws-cloudformation.yaml \
  --capabilities CAPABILITY_IAM
```

3. **Deploy using deployment script:**
```bash
./deploy/deploy-aws.sh production
```

### Option 3: AWS Lambda (Serverless)

1. **Install Serverless Framework:**
```bash
npm install -g serverless
```

2. **Configure serverless.yml** (see `server/serverless.yml`)

3. **Deploy:**
```bash
serverless deploy
```

## Google Cloud Deployment

### Option 1: Google Cloud Run (Recommended)

1. **Set up project:**
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud auth login
```

2. **Build and deploy:**
```bash
cd server
./deploy/deploy-google.sh production
```

3. **Or manually:**
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/foodism-api
gcloud run deploy foodism-api \
  --image gcr.io/YOUR_PROJECT_ID/foodism-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: Google App Engine

1. **Create app.yaml:**
```yaml
runtime: nodejs18
env: standard

env_variables:
  DB_HOST: /cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
  DB_NAME: foodism_db
  DB_USER: postgres
  DB_PASSWORD: YOUR_PASSWORD
```

2. **Deploy:**
```bash
gcloud app deploy
```

### Option 3: Google Compute Engine

1. **Create VM instance:**
```bash
gcloud compute instances create foodism-api \
  --image-family ubuntu-2204-lts \
  --image-project ubuntu-os-cloud \
  --machine-type e2-medium
```

2. **SSH and install:**
```bash
gcloud compute ssh foodism-api

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and deploy
git clone YOUR_REPO
cd foodism-modern-editorial/server
npm install
npm start
```

## Database Setup

### AWS RDS (PostgreSQL)

1. **Create RDS instance:**
```bash
aws rds create-db-instance \
  --db-instance-identifier foodism-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20
```

2. **Run migrations:**
```bash
cd server
export DB_HOST=your-rds-endpoint.rds.amazonaws.com
export DB_PASSWORD=YOUR_PASSWORD
npm run migrate
npm run seed
```

### Google Cloud SQL (PostgreSQL)

1. **Create Cloud SQL instance:**
```bash
gcloud sql instances create foodism-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

2. **Create database:**
```bash
gcloud sql databases create foodism_db --instance=foodism-db
```

3. **Run migrations:**
```bash
cd server
export DB_HOST=/cloudsql/PROJECT_ID:REGION:foodism-db
npm run migrate
npm run seed
```

### MongoDB Atlas (Cross-Platform)

1. **Create cluster** at https://cloud.mongodb.com
2. **Get connection string**
3. **Update .env:**
```
DB_TYPE=mongodb
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/foodism_db
```

## Environment Configuration

### Backend (.env)

```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Database
DB_TYPE=postgresql
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=foodism_db
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_SSL=true

# AWS (if using S3)
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket

# Google Cloud (if using Cloud Storage)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket
```

### Frontend (.env)

```env
# Use API backend
VITE_USE_API=true
VITE_API_URL=https://your-api-domain.com/api

# Or use static JSON
VITE_USE_API=false
```

## Connecting Frontend to Backend

1. **Update frontend .env:**
```env
VITE_USE_API=true
VITE_API_URL=https://your-api-url.com/api
```

2. **Rebuild frontend:**
```bash
npm run build
```

## Health Checks

Test your API:
```bash
curl https://your-api-url.com/health
```

## Monitoring

- **AWS:** Use CloudWatch for logs and metrics
- **Google Cloud:** Use Cloud Monitoring and Cloud Logging

## Troubleshooting

### Database Connection Issues

- Check security groups (AWS) or authorized networks (Google Cloud)
- Verify credentials in environment variables
- Test connection from local machine first

### CORS Issues

- Update `FRONTEND_URL` in backend `.env`
- Check CORS configuration in `server/src/index.js`

## Support

For issues, check:
- Server logs: `gcloud logging read` or AWS CloudWatch
- Database logs: RDS/Cloud SQL console
- Application health: `/health` endpoint

