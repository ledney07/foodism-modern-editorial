# 🚀 Start Here - Deployment Guide

Welcome! This guide will help you deploy Foodism CA API to AWS or Google Cloud.

## 🎯 Choose Your Platform

### Option 1: Google Cloud (Easiest - Recommended for Beginners)
✅ Pay-per-use (very cost-effective)  
✅ Managed infrastructure  
✅ Quick deployment (5-10 minutes)  
📖 [Go to Google Cloud Guide →](#google-cloud)

### Option 2: AWS (More Control)
✅ Enterprise-grade infrastructure  
✅ More configuration options  
✅ Elastic Beanstalk or EC2 options  
📖 [Go to AWS Guide →](#aws)

---

## ☁️ Google Cloud Deployment (Recommended)

### Prerequisites (5 minutes)
```bash
# 1. Install Google Cloud SDK
brew install --cask google-cloud-sdk

# 2. Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 3. Enable billing (required for Cloud SQL)
```

### Quick Setup (5 minutes)
```bash
cd server/deploy
./setup-gcp.sh
```

This will:
- ✅ Enable required APIs
- ✅ Create Cloud SQL PostgreSQL database
- ✅ Create database and user
- ✅ Set up VPC connector
- ✅ Configure permissions

### Deploy (5 minutes)
```bash
cd ../..  # Back to server directory
export PROJECT_ID=$(gcloud config get-value project)
export CONNECTION_NAME=$(gcloud sql instances describe foodism-db --format='value(connectionName)')

# Build and deploy
gcloud builds submit --tag gcr.io/$PROJECT_ID/foodism-api
gcloud run deploy foodism-api \
  --image gcr.io/$PROJECT_ID/foodism-api \
  --region us-central1 \
  --add-cloudsql-instances=$CONNECTION_NAME \
  --set-env-vars="NODE_ENV=production,DB_TYPE=postgresql,DB_NAME=foodism_db,DB_USER=foodism_user,DB_PASSWORD=YOUR_PASSWORD,DB_HOST=/cloudsql/$CONNECTION_NAME" \
  --allow-unauthenticated

# Run migrations
# Download Cloud SQL Proxy:
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.darwin.arm64
chmod +x cloud-sql-proxy

# Start proxy
./cloud-sql-proxy $CONNECTION_NAME &

# Run migrations
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_NAME=foodism_db
export DB_USER=foodism_user
export DB_PASSWORD=YOUR_PASSWORD
export DB_SSL=false

npm run migrate
npm run seed
```

**🎉 Done! Your API is live!**

See `GOOGLE_CLOUD_DEPLOYMENT_GUIDE.md` for detailed steps.

---

## 🅰️ AWS Deployment

### Prerequisites (5 minutes)
```bash
# 1. Install AWS CLI
brew install awscli

# 2. Configure credentials
aws configure
# Enter: Access Key, Secret Key, Region (us-east-1), Format (json)
```

### Quick Setup (5 minutes)
```bash
cd server/deploy
./setup-aws.sh
```

This will:
- ✅ Create API Security Group
- ✅ Create Database Security Group
- ✅ Configure firewall rules
- ✅ Save configuration to `aws-infrastructure.env`

### Create Database (10 minutes)
```bash
# Source the configuration
source aws-infrastructure.env

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier foodism-api-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20 \
  --db-name foodism_db \
  --vpc-security-group-ids $DB_SECURITY_GROUP_ID

# Wait for database (5-10 minutes)
aws rds wait db-instance-available --db-instance-identifier foodism-api-db

# Get endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier foodism-api-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)
```

### Deploy Options

#### Option A: Elastic Beanstalk (Easiest)
```bash
cd server
pip3 install awsebcli
eb init -p "Node.js 18" foodism-api
eb create foodism-api-prod \
  --instance-type t3.micro \
  --envvars \
    NODE_ENV=production,\
    DB_HOST=$DB_ENDPOINT,\
    DB_PASSWORD=YourSecurePassword123!
eb deploy
```

#### Option B: EC2 (More Control)
```bash
# Create EC2 instance (see AWS_DEPLOYMENT_GUIDE.md)
# SSH into instance
# Clone repo, install dependencies, run migrations
# Start with PM2
```

See `AWS_DEPLOYMENT_GUIDE.md` for detailed steps.

---

## 📋 What Gets Created

### Security Groups / Firewall Rules
- **API Security Group** - Allows HTTP/HTTPS traffic
- **Database Security Group** - Allows PostgreSQL from API only

### Database
- **PostgreSQL 15** instance
- **Database**: `foodism_db`
- **User**: `foodism_user` (GCP) or `admin` (AWS)

### Application
- **API Server** - Running on port 3001
- **Health Check** - `/health` endpoint
- **API Routes** - `/api/articles`, `/api/categories`, etc.

---

## 🔍 Verify Deployment

### Test Health Endpoint
```bash
# Google Cloud
curl https://your-service-url.run.app/health

# AWS
curl http://your-eb-url.elasticbeanstalk.com/health
```

### Test API Endpoints
```bash
# Get articles
curl https://your-service-url/api/articles

# Get categories
curl https://your-service-url/api/categories
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `QUICK_START.md` | Fastest deployment path |
| `AWS_DEPLOYMENT_GUIDE.md` | Complete AWS guide |
| `GOOGLE_CLOUD_DEPLOYMENT_GUIDE.md` | Complete Google Cloud guide |
| `README.md` | Overview of all files |

---

## 🆘 Troubleshooting

### Database Connection Issues
- **AWS**: Check security group allows port 5432 from API security group
- **Google Cloud**: Check VPC connector is running and service account has permissions

### Application Won't Start
- Check environment variables are set correctly
- Verify database credentials
- Check logs: `pm2 logs` (EC2) or Cloud Run logs (GCP)

### Can't Access API
- **AWS**: Check security group allows HTTP/HTTPS (ports 80/443)
- **Google Cloud**: Check service is deployed and has unauthenticated access

---

## 🎓 Next Steps

1. ✅ Deploy API (you are here!)
2. Set up custom domain
3. Configure SSL certificate
4. Set up monitoring and alerts
5. Configure automated backups
6. Set up CI/CD pipeline

---

## 💰 Cost Estimates

### Google Cloud (Cloud Run)
- **Free Tier**: 2 million requests/month
- **After Free**: ~$0.40 per million requests
- **Cloud SQL**: $7.67/month (db-f1-micro)
- **Total**: ~$8-10/month

### AWS (EC2 + RDS)
- **EC2 t3.micro**: ~$7.50/month (750 hours free tier)
- **RDS db.t3.micro**: ~$15/month
- **Total**: ~$15-25/month

---

**Ready to deploy?** Choose your platform above and follow the steps! 🚀

