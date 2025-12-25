#!/bin/bash
# EC2 User Data Script for Foodism API
# This script runs when the EC2 instance starts

# Update system
yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install Git
yum install -y git

# Install PostgreSQL client
yum install -y postgresql15

# Install PM2 globally
npm install -g pm2

# Create app directory
mkdir -p /opt/foodism-api
cd /opt/foodism-api

# Clone repository (replace with your repo URL)
# git clone https://github.com/yourusername/foodism-modern-editorial.git .
# OR upload code via S3 or other method

# Install dependencies
# npm install

# Create systemd service for PM2
env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Note: After deployment, manually:
# 1. Copy your code to /opt/foodism-api
# 2. Create .env file with database credentials
# 3. Run: npm install
# 4. Run: npm run migrate
# 5. Run: npm run seed
# 6. Run: pm2 start src/index.js --name foodism-api
# 7. Run: pm2 save

