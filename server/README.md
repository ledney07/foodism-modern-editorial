# Foodism CA Backend API

Express.js REST API server for Foodism CA editorial platform, compatible with AWS and Google Cloud.

## Features

- ✅ RESTful API for articles and categories
- ✅ PostgreSQL database support (AWS RDS / Google Cloud SQL)
- ✅ MongoDB support (alternative)
- ✅ Image upload support (AWS S3 / Google Cloud Storage)
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Environment-based configuration

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

### 3. Set Up Database

#### PostgreSQL (AWS RDS / Google Cloud SQL)

```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

#### MongoDB (Alternative)

Update `.env`:
```
DB_TYPE=mongodb
MONGODB_URI=mongodb://your-mongodb-uri
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### Articles

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category

### Content

- `GET /api/content` - Get all content (categories + articles)

### Health

- `GET /health` - Health check endpoint

## Deployment

### AWS Deployment

#### Option 1: AWS Elastic Beanstalk

1. Install EB CLI:
```bash
brew install aws-elastic-beanstalk
```

2. Initialize:
```bash
eb init -p node.js foodism-api
eb create foodism-api-prod
```

3. Set environment variables in AWS Console or via CLI:
```bash
eb setenv DB_HOST=your-rds-endpoint DB_PASSWORD=your-password
```

#### Option 2: AWS EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. Install Node.js and PostgreSQL client
3. Clone repository and deploy
4. Use PM2 for process management

#### Option 3: AWS Lambda (Serverless)

See `deploy/aws-lambda/` for serverless setup.

### Google Cloud Deployment

#### Option 1: Google Cloud Run

1. Build container:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/foodism-api
```

2. Deploy:
```bash
gcloud run deploy foodism-api \
  --image gcr.io/YOUR_PROJECT_ID/foodism-api \
  --platform managed \
  --region us-central1
```

#### Option 2: Google App Engine

1. Create `app.yaml`:
```yaml
runtime: nodejs18
env: standard
env_variables:
  DB_HOST: your-cloud-sql-instance
```

2. Deploy:
```bash
gcloud app deploy
```

#### Option 3: Google Compute Engine

Similar to AWS EC2 setup.

## Database Setup

### AWS RDS (PostgreSQL)

1. Create RDS PostgreSQL instance
2. Update `.env`:
```
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_SSL=true
```

### Google Cloud SQL (PostgreSQL)

1. Create Cloud SQL instance
2. Enable Cloud SQL Proxy or use private IP
3. Update `.env`:
```
DB_HOST=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
# OR
DB_HOST=private-ip-address
```

### MongoDB Atlas (AWS/Google)

1. Create MongoDB Atlas cluster
2. Update `.env`:
```
DB_TYPE=mongodb
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/foodism_db
```

## Environment Variables

See `.env.example` for all available configuration options.

## Security

- Helmet.js for security headers
- CORS configured for frontend origin
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator

## License

MIT

