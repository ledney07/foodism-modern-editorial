import { getClient } from "../db/connection.js";

// PostgreSQL Model
export class Article {
  static async findAll() {
    const pool = getClient();
    const result = await pool.query(`
      SELECT 
        a.*,
        c.id as category_id,
        c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category = c.name
      ORDER BY a.created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const pool = getClient();
    const result = await pool.query(
      `SELECT 
        a.*,
        c.id as category_id,
        c.slug as category_slug
       FROM articles a
       LEFT JOIN categories c ON a.category = c.name
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByCategory(category) {
    const pool = getClient();
    const result = await pool.query(
      `SELECT * FROM articles WHERE category = $1 ORDER BY created_at DESC`,
      [category]
    );
    return result.rows;
  }

  static async findTrending() {
    const pool = getClient();
    const result = await pool.query(
      `SELECT * FROM articles WHERE trending = true ORDER BY created_at DESC`
    );
    return result.rows;
  }

  static async create(articleData) {
    const pool = getClient();
    const {
      title,
      excerpt,
      content,
      author,
      date,
      category,
      image,
      readTime,
      trending = false,
      tags = [],
      takeaways = [],
    } = articleData;

    const result = await pool.query(
      `INSERT INTO articles (
        title, excerpt, content, author, date, category,
        image, read_time, trending, tags, takeaways
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        title,
        excerpt,
        content,
        author,
        date,
        category,
        image,
        readTime,
        trending,
        tags,
        takeaways,
      ]
    );
    return result.rows[0];
  }

  static async update(id, articleData) {
    const pool = getClient();
    const {
      title,
      excerpt,
      content,
      author,
      date,
      category,
      image,
      readTime,
      trending,
      tags,
      takeaways,
    } = articleData;

    const fields = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (excerpt !== undefined) {
      fields.push(`excerpt = $${paramCount++}`);
      values.push(excerpt);
    }
    if (content !== undefined) {
      fields.push(`content = $${paramCount++}`);
      values.push(content);
    }
    if (author !== undefined) {
      fields.push(`author = $${paramCount++}`);
      values.push(author);
    }
    if (date !== undefined) {
      fields.push(`date = $${paramCount++}`);
      values.push(date);
    }
    if (category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(category);
    }
    if (image !== undefined) {
      fields.push(`image = $${paramCount++}`);
      values.push(image);
    }
    if (readTime !== undefined) {
      fields.push(`read_time = $${paramCount++}`);
      values.push(readTime);
    }
    if (trending !== undefined) {
      fields.push(`trending = $${paramCount++}`);
      values.push(trending);
    }
    if (tags !== undefined) {
      fields.push(`tags = $${paramCount++}`);
      values.push(tags);
    }
    if (takeaways !== undefined) {
      fields.push(`takeaways = $${paramCount++}`);
      values.push(takeaways);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE articles SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const pool = getClient();
    const result = await pool.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}
