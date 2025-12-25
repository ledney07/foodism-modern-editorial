import express from "express";
import { body, param, validationResult } from "express-validator";
import { Article } from "../models/Article.js";

const router = express.Router();

// Validation middleware
const validateArticle = [
  body("title").notEmpty().withMessage("Title is required"),
  body("excerpt").notEmpty().withMessage("Excerpt is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("image").notEmpty().withMessage("Image URL is required"),
  body("readTime").notEmpty().withMessage("Read time is required"),
];

// GET /api/articles - Get all articles
router.get("/", async (req, res, next) => {
  try {
    const { category, trending } = req.query;

    let articles;
    if (category) {
      articles = await Article.findByCategory(category);
    } else if (trending === "true") {
      articles = await Article.findTrending();
    } else {
      articles = await Article.findAll();
    }

    // Format response to match frontend expectations
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

    res.json(formattedArticles);
  } catch (error) {
    next(error);
  }
});

// GET /api/articles/:id - Get single article
router.get(
  "/:id",
  [param("id").isInt().withMessage("Invalid article ID")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const article = await Article.findById(req.params.id);

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Format response
      const formattedArticle = {
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
      };

      res.json(formattedArticle);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/articles - Create new article
router.post("/", validateArticle, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const article = await Article.create(req.body);

    const formattedArticle = {
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
    };

    res.status(201).json(formattedArticle);
  } catch (error) {
    next(error);
  }
});

// PUT /api/articles/:id - Update article
router.put(
  "/:id",
  [param("id").isInt().withMessage("Invalid article ID"), ...validateArticle],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const article = await Article.update(req.params.id, req.body);

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      const formattedArticle = {
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
      };

      res.json(formattedArticle);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/articles/:id - Delete article
router.delete(
  "/:id",
  [param("id").isInt().withMessage("Invalid article ID")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const article = await Article.delete(req.params.id);

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.json({ message: "Article deleted successfully", id: article.id });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
