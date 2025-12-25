# Deployment Scripts and Guides 📚

This directory contains everything you need to deploy Foodism CA API to AWS or Google Cloud.

## 📋 Quick Navigation

- **`QUICK_START.md`** - Fastest path to deployment (start here!)
- **`AWS_DEPLOYMENT_GUIDE.md`** - Complete AWS step-by-step guide
- **`GOOGLE_CLOUD_DEPLOYMENT_GUIDE.md`** - Complete Google Cloud step-by-step guide

## 🛠️ Setup Scripts

### AWS Setup
```bash
./setup-aws.sh
```
Creates security groups and initial infrastructure. Saves configuration to `aws-infrastructure.env`.

### Google Cloud Setup
```bash
./setup-gcp.sh
```
Creates Cloud SQL instance, database, and VPC connector. Saves configuration to `gcp-infrastructure.env`.

## 🚀 Deployment Scripts

### AWS Deployment
```bash
./deploy-aws.sh [environment]
```
Deploys to AWS using Docker and ECR/ECS.

### Google Cloud Deployment
```bash
./deploy-google.sh [environment]
```
Deploys to Google Cloud Run.

## 📁 Files

- **`aws-cloudformation.yaml`** - CloudFormation template for AWS infrastructure
- **`google-cloud-run.yaml`** - Kubernetes YAML for Google Cloud Run
- **`ec2-user-data.sh`** - EC2 startup script for AWS deployments
- **`setup-aws.sh`** - Automated AWS infrastructure setup
- **`setup-gcp.sh`** - Automated Google Cloud infrastructure setup

## 📖 Guides

### AWS Deployment Guide
Complete guide covering:
- Security groups creation
- RDS database setup
- EC2 deployment
- Elastic Beanstalk deployment
- Load balancer setup
- Monitoring and logging

### Google Cloud Deployment Guide
Complete guide covering:
- Cloud SQL setup
- Cloud Run deployment
- Compute Engine deployment
- App Engine deployment
- VPC and firewall configuration
- Monitoring and logging

## 🎯 Recommended Deployment Path

1. **Read `QUICK_START.md`** - Get overview
2. **Run setup script** - `./setup-aws.sh` or `./setup-gcp.sh`
3. **Follow detailed guide** - Choose your platform's guide
4. **Deploy** - Use deployment scripts or manual commands

## 💡 Tips

- Start with Google Cloud Run for easiest deployment
- Use AWS Elastic Beanstalk for AWS quick start
- Cloud SQL Proxy is needed for local database access on GCP
- Security groups must allow database access from API on AWS

## 🆘 Need Help?

- Check troubleshooting sections in the guides
- Verify environment variables are set correctly
- Check security group/firewall rules
- Review logs for errors

