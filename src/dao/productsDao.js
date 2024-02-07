import { ProductEsquema } from "./models/products.model.js";

export class ProductsMongoDao {

    async get(query) {
        try {
            const products = await ProductEsquema.find({ ...query, deleted: false }).lean();
            return products;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw error;
        }
    }

    async getById(productId) {
        try {
            const product = await ProductEsquema.findById({ _id: productId, deleted: false });
            return product;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            throw error;
        }
    }

    async getByCode(productByCode) {
        try {
            const productCode = await ProductEsquema.findOne({ code: productByCode });
            return productCode;
        } catch (error) {
            console.error("Error al obtener producto por código:", error);
            throw error;
        }
    }

    async create(product) {
        try {
            const newProduct = await ProductEsquema.create(product);
            return newProduct;
        } catch (error) {
            console.error("Error al crear producto:", error);
            throw error;
        }
    }

    async updateProduct(productId, updatedData) {
        try {
            const updatedProduct = await ProductEsquema.findByIdAndUpdate(
                { _id: productId },
                { $set: updatedData },
                { new: true } // Devuelve el documento modificado
            );
            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }
}