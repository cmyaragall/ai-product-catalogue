import "dotenv/config";
import enquiryRoutes from "./routes/enquiryRoutes";
import express from "express";
import cors from "cors";
import {
  getProducts,
  getTopRated,
  searchProducts
} from "./services/productService";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/enquiries", enquiryRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await getProducts();
    const search = req.query.search;

    if (typeof search === "string" && search.trim()) {
      return res.json(searchProducts(products, search));
    }

    res.json(products);
  } catch {
    res.status(502).json({ error: "Unable to retrieve products" });
  }
});

app.get("/api/products/featured", async (_req, res) => {
  try {
    const products = await getProducts();
    res.json(getTopRated(products, 5));
  } catch {
    res.status(502).json({ error: "Unable to retrieve featured products" });
  }
});

app.get("/api/categories", async (_req, res) => {
  try {
    const products = await getProducts();
    res.json([...new Set(products.map(p => p.category))].sort());
  } catch {
    res.status(502).json({ error: "Unable to retrieve categories" });
  }
});

app.get("/api/categories/:category/products", async (req, res) => {
  try {
    const products = await getProducts();

    const categoryProducts = products.filter(
      p => p.category.toLowerCase() ===
        String(req.params.category).toLowerCase()
    );

    if (categoryProducts.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const topRated = getTopRated(categoryProducts, 5);
    const topIds = new Set(topRated.map(p => p.id));

    res.json({
      category: req.params.category,
      topRated,
      additional: categoryProducts.filter(p => !topIds.has(p.id))
    });
  } catch {
    res.status(502).json({ error: "Unable to retrieve category products" });
  }
});

//const PORT = Number(process.env.PORT) || 3001;

// app.listen(PORT, () => {
//   console.log(`Backend running at http://localhost:${PORT}`);
// });

export default app;