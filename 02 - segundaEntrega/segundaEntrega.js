const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProductsFromFile();
    }

    addProduct(productData) {
        // Aca asigno un id autoincrementable al prod
        const newProductId = this.products.length + 1;
        const product = { id: newProductId, ...productData };
        this.products.push(product);
        this.saveProductsToFile();
        return console.log("Producto agregado exitosamente.");
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) return console.log("Producto no encontrado.");
        return product;
    }

    updateProduct(productId, newData) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...newData };
            this.saveProductsToFile();
            return true;
        }
        return console.log("Producto no encontrado.");
    }

    deleteProduct(productId) {
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.id !== productId);
        if (this.products.length !== initialLength) {
            this.saveProductsToFile();
            return console.log("Producto eliminado exitosamente.");
        }
        return console.log("Producto no encontrado.");
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log("Error al cargar productos desde el archivo:", error.message);
        }
    }

    saveProductsToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log("Error al guardar productos en el archivo:", error.message);
        }
    }
}

// Ejemplo
const productManager = new ProductManager("productos.json");

// agregar prod
productManager.addProduct({
    title: "Producto 1",
    description: "Descripción del Producto 1",
    price: 10,
    thumbnail: "ruta/imagenDeEjemplo1.jpg",
    code: "ABC123",
    stock: 100
});
productManager.addProduct({
    title: "Producto 2",
    description: "Descripción del Producto 2",
    price: 20,
    thumbnail: "ruta/imagenDeEjemplo2.jpg",
    code: "DEF456",
    stock: 50
});

// Obtener prod
const products = productManager.getProducts();
console.log(products);

// Obtener prod por id
const product = productManager.getProductById(1);
console.log(product);
