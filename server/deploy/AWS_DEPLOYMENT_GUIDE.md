# Step-by-Step AWS Deployment Guide 🚀

Complete guide to deploy Foodism CA API to AWS with all infrastructure components.

## Prerequisites

- AWS Account (free tier eligible)
- AWS CLI installed and configured
- Node.js 18+ installed locally
- Basic knowledge of AWS services

## Step 1: Install and Configure AWS CLI

### Install AWS CLI (if not installed)

**macOS:**
```bash
brew install awscli
```

**Or download from:**
https://aws.amazon.com/cli/

### Configure AWS Credentials

```bash
aws configure
```

Enter:
- AWS Access Key ID: `your-access-key`
- AWS Secret Access Key: `your-secret-key`
- Default region: `us-east-1` (or your preferred region)
- Default output format: `json`

**Or create credentials file manually:**
```bash
mkdir -p ~/.aws
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
EOF

cat > ~/.aws/config << EOF
[default]
region = us-east-1
output = json
EOF
```

Verify configuration:
```bash
aws sts get-caller-identity
```

---

## Step 2: Create RDS PostgreSQL Database

### 2.1 Create Database Subnet Group

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name foodism-db-subnet-group \
  --db-subnet-group-description "Subnet group for Foodism database" \
  --subnet-ids subnet-12345678 subnet-87654321 \
  --tags Key=Project,Value=Foodism
```

**Note:** Replace subnet IDs with your VPC subnet IDs. If you don't have a VPC, AWS will use default VPC.

### 2.2 Create Security Group for Database

```bash
# First, get your default VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)

# Create security group for database
DB_SG_ID=$(aws ec2 create-security-group \
  --group-name foodism-db-sg \
  --description "Security group for Foodism RDS database" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

echo "Database Security Group ID: $DB_SG_ID"
```

### 2.3 Create Security Group for API Server

```bash
# Create security group for API
API_SG_ID=$(aws ec2 create-security-group \
  --group-name foodism-api-sg \
  --description "Security group for Foodism API server" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

echo "API Security Group ID: $API_SG_ID"
```

### 2.4 Configure Security Group Rules

**Allow API to access Database:**
```bash
# Get your API security group ID (from previous step or query)
API_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=foodism-api-sg" \
  --query "SecurityGroups[0].GroupId" \
  --output text)

# Allow PostgreSQL from API security group
aws ec2 authorize-security-group-ingress \
  --group-id $DB_SG_ID \
  --protocol tcp \
  --port 5432 \
  --source-group $API_SG_ID
```

**Allow HTTP/HTTPS to API:**
```bash
# Allow HTTP from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id $API_SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id $API_SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow SSH from your IP (for EC2 management)
YOUR_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress \
  --group-id $API_SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr $YOUR_IP/32
```

### 2.5 Create RDS Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier foodism-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20 \
  --storage-type gp3 \
  --db-name foodism_db \
  --vpc-security-group-ids $DB_SG_ID \
  --db-subnet-group-name foodism-db-subnet-group \
  --backup-retention-period 7 \
  --publicly-accessible false \
  --storage-encrypted
```

**Wait for database to be available (5-10 minutes):**
```bash
aws rds wait db-instance-available --db-instance-identifier foodism-db
```

**Get database endpoint:**
```bash
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier foodism-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

echo "Database Endpoint: $DB_ENDPOINT"
```

---

## Step 3: Deploy API to EC2

### 3.1 Create EC2 Instance

```bash
# Get latest Amazon Linux 2023 AMI
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=al2023-ami-*-x86_64" "Name=state,Values=available" \
  --query "Images | sort_by(@, &CreationDate) | [-1].ImageId" \
  --output text)

# Create EC2 instance
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id $AMI_ID \
  --instance-type t3.micro \
  --key-name your-key-pair-name \
  --security-group-ids $API_SG_ID \
  --user-data file://deploy/ec2-user-data.sh \
  --query 'Instances[0].InstanceId' \
  --output text)

echo "EC2 Instance ID: $INSTANCE_ID"
```

**Note:** Replace `your-key-pair-name` with your EC2 key pair name, or create one:
```bash
aws ec2 create-key-pair --key-name foodism-key --query 'KeyMaterial' --output text > ~/.ssh/foodism-key.pem
chmod 400 ~/.ssh/foodism-key.pem
```

### 3.2 Get EC2 Public IP

```bash
# Wait for instance to be running
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

echo "EC2 Public IP: $PUBLIC_IP"
```

### 3.3 SSH into EC2 and Set Up Application

```bash
ssh -i ~/.ssh/foodism-key.pem ec2-user@$PUBLIC_IP
```

**Inside EC2, run:**
```bash
# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Install PostgreSQL client
sudo yum install -y postgresql15

# Clone repository (or upload your code)
git clone YOUR_REPO_URL
cd foodism-modern-editorial/server

# Install dependencies
npm install

# Set up environment variables
cat > .env << EOF
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

DB_TYPE=postgresql
DB_HOST=$DB_ENDPOINT
DB_PORT=5432
DB_NAME=foodism_db
DB_USER=admin
DB_PASSWORD=YourSecurePassword123!
DB_SSL=true
EOF

# Run migrations
npm run migrate

# Seed database
npm run seed

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start src/index.js --name foodism-api

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## Step 4: Alternative - Deploy to Elastic Beanstalk

### 4.1 Install EB CLI

```bash
pip3 install awsebcli --upgrade --user
```

### 4.2 Initialize Elastic Beanstalk

```bash
cd server
eb init -p "Node.js 18 running on 64bit Amazon Linux 2023" -r us-east-1 foodism-api
```

### 4.3 Create Environment

```bash
eb create foodism-api-prod \
  --instance-type t3.micro \
  --database.engine postgres \
  --database.instance db.t3.micro \
  --database.username admin \
  --database.password 'YourSecurePassword123!' \
  --envvars \
    NODE_ENV=production,\
    DB_TYPE=postgresql,\
    DB_PORT=5432,\
    DB_NAME=ebdb,\
    DB_HOST=your-rds-endpoint.rds.amazonaws.com,\
    DB_USER=admin,\
    DB_PASSWORD=YourSecurePassword123!,\
    DB_SSL=true
```

### 4.4 Deploy

```bash
eb deploy
```

---

## Step 5: Set Up Application Load Balancer (Optional)

### 5.1 Create Target Group

```bash
TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
  --name foodism-api-targets \
  --protocol HTTP \
  --port 3001 \
  --vpc-id $VPC_ID \
  --health-check-path /health \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)
```

### 5.2 Register EC2 Instance

```bash
aws elbv2 register-targets \
  --target-group-arn $TARGET_GROUP_ARN \
  --targets Id=$INSTANCE_ID
```

### 5.3 Create Load Balancer

```bash
# Get subnet IDs
SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query "Subnets[*].SubnetId" \
  --output text | tr '\t' ' ')

ALB_ARN=$(aws elbv2 create-load-balancer \
  --name foodism-api-alb \
  --subnets $SUBNET_IDS \
  --security-groups $API_SG_ID \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

echo "Load Balancer DNS: $ALB_DNS"
```

---

## Step 6: Set Up CloudWatch Logs

```bash
# Create log group
aws logs create-log-group --log-group-name /aws/ec2/foodism-api

# Configure EC2 to send logs (add to user-data script)
```

---

## Step 7: Verify Deployment

### 7.1 Test Health Endpoint

```bash
curl http://$PUBLIC_IP:3001/health
# Or if using load balancer:
curl http://$ALB_DNS/health
```

### 7.2 Test API Endpoints

```bash
# Get articles
curl http://$PUBLIC_IP:3001/api/articles

# Get categories
curl http://$PUBLIC_IP:3001/api/categories
```

---

## Step 8: Set Up Domain and SSL (Optional)

### 8.1 Request SSL Certificate

```bash
aws acm request-certificate \
  --domain-name api.yourdomain.com \
  --validation-method DNS
```

### 8.2 Add Certificate to Load Balancer

```bash
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:region:account:certificate/cert-id \
  --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN
```

---

## Environment Variables Summary

Create `.env` file on your EC2 instance:

```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

DB_TYPE=postgresql
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=foodism_db
DB_USER=admin
DB_PASSWORD=YourSecurePassword123!
DB_SSL=true
```

---

## Troubleshooting

### Check EC2 logs:
```bash
ssh -i ~/.ssh/foodism-key.pem ec2-user@$PUBLIC_IP
pm2 logs foodism-api
```

### Check database connection:
```bash
psql -h $DB_ENDPOINT -U admin -d foodism_db
```

### View security groups:
```bash
aws ec2 describe-security-groups --group-names foodism-api-sg foodism-db-sg
```

---

## Clean Up Resources

```bash
# Delete RDS instance
aws rds delete-db-instance --db-instance-identifier foodism-db --skip-final-snapshot

# Terminate EC2 instance
aws ec2 terminate-instances --instance-ids $INSTANCE_ID

# Delete security groups
aws ec2 delete-security-group --group-id $API_SG_ID
aws ec2 delete-security-group --group-id $DB_SG_ID

# Delete load balancer
aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN
```

---

## Next Steps

1. Set up automated backups
2. Configure CloudWatch alarms
3. Set up CI/CD pipeline
4. Add CloudFront CDN
5. Enable AWS WAF for security

