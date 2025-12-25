import express from "express";
import { Category } from "../models/Category.js";
import { Article } from "../models/Article.js";

const router = express.Router();

// GET /api/content - Get all content (categories + articles) similar to JSON structure
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    const articles = await Article.findAll();

    const formattedCategories = categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    }));

    const formattedArticles = articles.map((article) => ({
      id: article.id.toString(),
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      date: article.date,
      category: article.category,
      image: article.image,
      readTime: article.read_time,
      trending: article.trending || false,
      tags: article.tags || [],
      takeaways: article.takeaways || [],
    }));

    res.json({
      categories: formattedCategories,
      articles: formattedArticles,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
