import { sql, connectMssqlDB } from '../config/db.js';

// Function to create a new address
export async function createAddress(addressData) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('address_line', sql.NVarChar, addressData.address_line || '')
            .input('city', sql.NVarChar, addressData.city || '')
            .input('state', sql.NVarChar, addressData.state || '')
            .input('pincode', sql.NVarChar, addressData.pincode || null)
            .input('country', sql.NVarChar, addressData.country || null)
            .input('mobile', sql.NVarChar, addressData.mobile || null)
            .input('status', sql.Bit, addressData.status === undefined ? true : addressData.status)
            .input('userId', sql.Int, addressData.userId)
            .query(`INSERT INTO Addresses (address_line, city, state, pincode, country, mobile, status, userId)
                    VALUES (@address_line, @city, @state, @pincode, @country, @mobile, @status, @userId);
                    SELECT SCOPE_IDENTITY() as id;`);
        return result.recordset[0].id;
    } catch (err) {
        console.error("Error creating address:", err);
        throw err;
    }
}

// Function to find addresses by userId
export async function findAddressesByUserId(userId) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM Addresses WHERE userId = @userId');
        return result.recordset;
    } catch (err) {
        console.error("Error finding addresses by user ID:", err);
        throw err;
    }
}

// Function to find an address by ID
export async function findAddressById(id) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Addresses WHERE id = @id');
        return result.recordset[0];
    } catch (err) {
        console.error("Error finding address by ID:", err);
        throw err;
    }
}

// Add more functions as needed (e.g., updateAddress, deleteAddress)
