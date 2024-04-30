import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const port = 3000;

const productManager = new ProductManager("./data/products.json");

// Endpoint para obtener todos los productos (opcionalmente limitados)
app.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); // Obtener el parámetro de consulta limit
    const products = await productManager.getAllProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un producto por ID
app.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await productManager.getProductById(productId);
    if (!product) {
      res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
