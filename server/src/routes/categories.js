import express from "express";
import { body, param, validationResult } from "express-validator";
import { Category } from "../models/Category.js";

const router = express.Router();

// GET /api/categories - Get all categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    const formatted = categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    }));
    res.json(formatted);
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:slug - Get category by slug
router.get("/:slug", async (req, res, next) => {
  try {
    const category = await Category.findBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ name: category.name, slug: category.slug });
  } catch (error) {
    next(error);
  }
});

// POST /api/categories - Create category
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = await Category.create(req.body);
      res.status(201).json({ name: category.name, slug: category.slug });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
