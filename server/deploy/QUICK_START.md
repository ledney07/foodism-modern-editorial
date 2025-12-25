# Quick Start Deployment Guide ⚡

Choose your platform and follow the quickest path to deployment.

## 🚀 AWS - Quick Deploy (5 minutes)

### Prerequisites
```bash
# Install AWS CLI and configure
aws configure
```

### One-Command Setup Script

Create and run this script:

```bash
#!/bin/bash
# AWS Quick Deploy Script

PROJECT_NAME="foodism-api"
REGION="us-east-1"
DB_PASSWORD="YourSecurePassword123!"

# Create VPC and subnets (or use default)
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)

# Create security groups
echo "Creating security groups..."
API_SG=$(aws ec2 create-security-group --group-name ${PROJECT_NAME}-api-sg \
  --description "API Security Group" --vpc-id $VPC_ID --query 'GroupId' --output text)

DB_SG=$(aws ec2 create-security-group --group-name ${PROJECT_NAME}-db-sg \
  --description "DB Security Group" --vpc-id $VPC_ID --query 'GroupId' --output text)

# Configure security groups
aws ec2 authorize-security-group-ingress --group-id $DB_SG --protocol tcp --port 5432 --source-group $API_SG
aws ec2 authorize-security-group-ingress --group-id $API_SG --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $API_SG --protocol tcp --port 443 --cidr 0.0.0.0/0

# Create RDS
echo "Creating RDS database (this takes ~5 minutes)..."
aws rds create-db-instance \
  --db-instance-identifier ${PROJECT_NAME}-db \
  --db-instance-class db.t3.micro \
  --engine postgres --engine-version 15.4 \
  --master-username admin \
  --master-user-password "$DB_PASSWORD" \
  --allocated-storage 20 \
  --db-name foodism_db \
  --vpc-security-group-ids $DB_SG

echo "Waiting for database..."
aws rds wait db-instance-available --db-instance-identifier ${PROJECT_NAME}-db

DB_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier ${PROJECT_NAME}-db \
  --query 'DBInstances[0].Endpoint.Address' --output text)

echo "✅ Database ready at: $DB_ENDPOINT"
echo "✅ API Security Group: $API_SG"
echo "✅ DB Security Group: $DB_SG"
echo ""
echo "Next: Deploy your code to EC2 or Elastic Beanstalk"
```

Save as `deploy-aws-quick.sh` and run:
```bash
chmod +x deploy-aws-quick.sh
./deploy-aws-quick.sh
```

---

## ☁️ Google Cloud - Quick Deploy (5 minutes)

### Prerequisites
```bash
# Install gcloud and authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### One-Command Setup Script

```bash
#!/bin/bash
# Google Cloud Quick Deploy Script

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
DB_PASSWORD="YourSecurePassword123!"

echo "Creating Cloud SQL instance..."
gcloud sql instances create foodism-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --root-password="$DB_PASSWORD"

echo "Creating database..."
gcloud sql databases create foodism_db --instance=foodism-db

echo "Creating user..."
gcloud sql users create foodism_user \
  --instance=foodism-db \
  --password="$DB_PASSWORD"

CONNECTION_NAME=$(gcloud sql instances describe foodism-db \
  --format='value(connectionName)')

echo "✅ Database ready"
echo "Connection Name: $CONNECTION_NAME"
echo ""
echo "Next: Deploy to Cloud Run"
```

Save as `deploy-gcp-quick.sh` and run:
```bash
chmod +x deploy-gcp-quick.sh
./deploy-gcp-quick.sh
```

Then deploy:
```bash
cd server
gcloud builds submit --tag gcr.io/$PROJECT_ID/foodism-api
gcloud run deploy foodism-api \
  --image gcr.io/$PROJECT_ID/foodism-api \
  --add-cloudsql-instances=$CONNECTION_NAME \
  --set-env-vars="DB_TYPE=postgresql,DB_NAME=foodism_db,DB_USER=foodism_user,DB_PASSWORD=$DB_PASSWORD,DB_HOST=/cloudsql/$CONNECTION_NAME"
```

---

## 📋 Deployment Checklist

### Before Deployment
- [ ] AWS/Google Cloud account set up
- [ ] CLI tools installed and configured
- [ ] Database password chosen (secure!)
- [ ] Environment variables prepared

### AWS Deployment
- [ ] Security groups created
- [ ] RDS instance created
- [ ] EC2 instance or Elastic Beanstalk ready
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Database seeded

### Google Cloud Deployment
- [ ] Cloud SQL instance created
- [ ] Database and user created
- [ ] Cloud Run or Compute Engine ready
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Database seeded

### After Deployment
- [ ] Health endpoint responding
- [ ] API endpoints working
- [ ] Database accessible
- [ ] Logs configured
- [ ] Monitoring set up

---

## 🔧 Environment Variables Template

Create `.env` file:

```env
# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com

# Database - AWS RDS
DB_TYPE=postgresql
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=foodism_db
DB_USER=admin
DB_PASSWORD=YourSecurePassword123!
DB_SSL=true

# Database - Google Cloud SQL (Cloud Run)
# DB_HOST=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
# DB_SSL=false (Cloud SQL handles SSL)

# Database - Google Cloud SQL (Compute Engine with Proxy)
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_SSL=false
```

---

## 🆘 Quick Troubleshooting

### Database Connection Issues
```bash
# AWS: Check security group rules
aws ec2 describe-security-groups --group-ids YOUR_SG_ID

# Google Cloud: Check authorized networks
gcloud sql instances describe foodism-db
```

### Application Not Starting
```bash
# Check logs
# AWS EC2:
pm2 logs

# Google Cloud Run:
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

### Run Migrations Remotely
```bash
# AWS: SSH into EC2
ssh -i key.pem ec2-user@IP
cd /opt/foodism-api
npm run migrate

# Google Cloud: Use Cloud SQL Proxy locally
./cloud-sql-proxy CONNECTION_NAME
export DB_HOST=127.0.0.1
npm run migrate
```

---

## 📚 Full Guides

- **AWS:** See `AWS_DEPLOYMENT_GUIDE.md` for detailed steps
- **Google Cloud:** See `GOOGLE_CLOUD_DEPLOYMENT_GUIDE.md` for detailed steps

---

## 💡 Recommended Approach

**For Quick Testing:** Use Google Cloud Run (easiest, pay-per-use)

**For Production:** 
- AWS: Use Elastic Beanstalk + RDS
- Google Cloud: Use Cloud Run + Cloud SQL

**For Maximum Control:** 
- AWS: Use EC2 + RDS
- Google Cloud: Use Compute Engine + Cloud SQL

