import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async readData() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return []; // Devuelve un array vacío si hay un error o el archivo no existe
    }
  }

  async getAllProducts(limit = null) {
    try {
      const products = await this.readData();
      if (limit !== null && limit > 0) {
        return products.slice(0, limit);
      }
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.readData();
      return products.find((product) => product.id === productId) || null;
    } catch (error) {
      throw new Error(`Error al obtener el producto con ID ${productId}`);
    }
  }

  async addProduct(productObj) {
    try {
      const products = await this.readData();
      const newProduct = { id: uuidv4(), ...productObj };
      products.push(newProduct);
      await fs.promises.writeFile(this.filePath, JSON.stringify(products));
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar el producto");
    }
  }

  async updateProduct(productId, updatedFields) {
    try {
      const products = await this.readData();
      const index = products.findIndex((product) => product.id === productId);

      if (index === -1) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }

      const updatedProduct = { ...products[index], ...updatedFields };
      products[index] = updatedProduct;
      await fs.promises.writeFile(this.filePath, JSON.stringify(products));
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar el producto con ID ${productId}`);
    }
  }

  async deleteProduct(productId) {
    try {
      const products = await this.readData();
      const updatedProducts = products.filter((product) => product.id !== productId);

      if (products.length === updatedProducts.length) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }

      await fs.promises.writeFile(this.filePath, JSON.stringify(updatedProducts));
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar el producto con ID ${productId}`);
    }
  }

  async deleteFile() {
    try {
      await fs.promises.unlink(this.filePath);
      console.log("Archivo de productos eliminado");
    } catch (error) {
      throw new Error("Error al eliminar el archivo de productos");
    }
  }
}
