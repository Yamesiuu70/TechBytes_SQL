import { sql, connectMssqlDB } from '../config/db.js';

// Function to create a new product
export async function createProduct(productData) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('name', sql.NVarChar, productData.name)
            .input('price', sql.Decimal(10, 2), productData.price)
            .input('photo', sql.NVarChar, productData.photo)
            .input('details', sql.NVarChar, productData.details)
            .input('categoryId', sql.Int, productData.categoryId)
            .query(`INSERT INTO Products (name, price, photo, details, categoryId)
                    VALUES (@name, @price, @photo, @details, @categoryId);
                    SELECT SCOPE_IDENTITY() as id;`);
        return result.recordset[0].id;
    } catch (err) {
        console.error("Error creating product:", err);
        throw err;
    }
}

// Function to get products by category ID
export async function getProductsByCategoryId(categoryId) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('categoryId', sql.Int, categoryId)
            .query('SELECT * FROM Products WHERE categoryId = @categoryId');
        return result.recordset;
    } catch (err) {
        console.error("Error getting products by category ID:", err);
        throw err;
    }
}

// Function to get a product by ID
export async function getProductById(id) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Products WHERE id = @id');
        return result.recordset[0];
    } catch (err) {
        console.error("Error getting product by ID:", err);
        throw err;
    }
}
// Function to count all products
export async function countProducts() {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request.query('SELECT COUNT(*) AS count FROM Products');
        return result.recordset[0].count;
    } catch (err) {
        console.error("Error counting products:", err);
        throw err;
    }
}
