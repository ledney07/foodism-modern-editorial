import { getClient } from "../db/connection.js";

export class Category {
  static async findAll() {
    const pool = getClient();
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    return result.rows;
  }

  static async findBySlug(slug) {
    const pool = getClient();
    const result = await pool.query(
      "SELECT * FROM categories WHERE slug = $1",
      [slug]
    );
    return result.rows[0];
  }

  static async create(categoryData) {
    const pool = getClient();
    const { name, slug } = categoryData;
    const result = await pool.query(
      "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *",
      [name, slug]
    );
    return result.rows[0];
  }

  static async update(id, categoryData) {
    const pool = getClient();
    const { name, slug } = categoryData;
    const result = await pool.query(
      "UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *",
      [name, slug, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const pool = getClient();
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}
