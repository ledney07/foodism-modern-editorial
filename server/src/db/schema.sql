-- PostgreSQL Schema for Foodism CA Articles

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  date VARCHAR(100) NOT NULL,
  category VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image VARCHAR(1000) NOT NULL,
  read_time VARCHAR(50) NOT NULL,
  trending BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  takeaways TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(title, author, date)
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);

CREATE INDEX IF NOT EXISTS idx_articles_trending ON articles (trending);

CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();