// routes/home.routes.js
import { Router } from "express";
import { findCategoryByName } from "../utils/category.db.js";
import { findProductsByCategoryId } from "../utils/product.db.js";

const homeRouter = Router();

// GET featured products (e.g., from 'Laptops' category)
homeRouter.get("/", async (req, res) => {
  try {
    // Find the 'Laptops' category by name
    const featuredCategory = await findCategoryByName('Laptops'); // Using category name for lookup

    if (!featuredCategory) {
      return res.status(404).json({ message: "Featured category not found!" });
    }

    // Find products within that category
    const products = await findProductsByCategoryId(featuredCategory.id);

    res.json(products);
  } catch (err) {
    console.error("Home route fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default homeRouter;
