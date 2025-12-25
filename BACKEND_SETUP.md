# Backend Setup Complete! 🚀

## What Was Created

I've set up a complete backend infrastructure for AWS and Google Cloud deployment with the following:

### Backend Server (`/server`)

**Express.js REST API** with:
- ✅ PostgreSQL database support (AWS RDS / Google Cloud SQL)
- ✅ MongoDB support (alternative)
- ✅ Full CRUD operations for articles and categories
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Environment-based configuration
- ✅ Docker support
- ✅ Health check endpoint

### API Endpoints

**Articles:**
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `GET /api/articles?category=name` - Filter by category
- `GET /api/articles?trending=true` - Get trending articles
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

**Categories:**
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category

**Content:**
- `GET /api/content` - Get all content (categories + articles)

### Frontend Integration

**API Service** (`/src/services/api.ts`):
- TypeScript API client for all endpoints
- Automatic error handling
- Type-safe responses

**Current Status:**
- Frontend uses **static JSON** by default (no breaking changes)
- Can switch to API by setting `VITE_USE_API=true` in `.env`

## Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Set Up Database

**PostgreSQL (Local):**
```bash
# Create database
createdb foodism_db

# Run migrations
npm run migrate

# Seed with data
npm run seed
```

### 4. Start Backend Server

```bash
npm run dev
# Server runs on http://localhost:3001
```

### 5. (Optional) Connect Frontend to API

Update `.env` in root:
```env
VITE_USE_API=true
VITE_API_URL=http://localhost:3001/api
```

## Deployment Options

### AWS Deployment

1. **Elastic Beanstalk** (Easiest)
2. **ECS with Fargate** (Container-based)
3. **Lambda** (Serverless)
4. **EC2** (Traditional)

See `DEPLOYMENT.md` for detailed instructions.

### Google Cloud Deployment

1. **Cloud Run** (Recommended - Serverless containers)
2. **App Engine** (Managed platform)
3. **Compute Engine** (VMs)

See `DEPLOYMENT.md` for detailed instructions.

## Database Options

1. **PostgreSQL** (Recommended)
   - AWS: RDS PostgreSQL
   - Google: Cloud SQL PostgreSQL

2. **MongoDB** (Alternative)
   - MongoDB Atlas (works on both platforms)

## File Structure

```
server/
├── src/
│   ├── index.js              # Main server file
│   ├── db/
│   │   ├── connection.js     # Database connection (Postgres/MongoDB)
│   │   ├── schema.sql        # PostgreSQL schema
│   │   ├── migrate.js        # Migration script
│   │   └── seed.js           # Seed script (loads from content.json)
│   ├── models/
│   │   ├── Article.js        # Article model
│   │   └── Category.js       # Category model
│   └── routes/
│       ├── articles.js       # Article endpoints
│       ├── categories.js     # Category endpoints
│       └── content.js        # Combined content endpoint
├── deploy/
│   ├── aws-cloudformation.yaml  # AWS infrastructure
│   ├── deploy-aws.sh            # AWS deployment script
│   ├── google-cloud-run.yaml    # Google Cloud Run config
│   └── deploy-google.sh         # Google deployment script
├── Dockerfile                # Docker configuration
├── package.json              # Backend dependencies
└── README.md                 # Backend documentation
```

## Next Steps

1. **Local Development:**
   - Set up local PostgreSQL database
   - Run migrations and seed
   - Test API endpoints

2. **Choose Cloud Platform:**
   - AWS: Use Elastic Beanstalk or ECS
   - Google Cloud: Use Cloud Run (easiest)

3. **Set Up Database:**
   - Create RDS (AWS) or Cloud SQL (Google)
   - Run migrations on cloud database

4. **Deploy:**
   - Follow deployment guide in `DEPLOYMENT.md`
   - Update frontend to use API (optional)

## Environment Variables

See `server/.env.example` for all configuration options.

## Testing

Test the API:
```bash
# Health check
curl http://localhost:3001/health

# Get articles
curl http://localhost:3001/api/articles

# Get single article
curl http://localhost:3001/api/articles/1
```

## Support

- Backend README: `server/README.md`
- Deployment Guide: `DEPLOYMENT.md`
- API Documentation: See endpoint files in `server/src/routes/`

