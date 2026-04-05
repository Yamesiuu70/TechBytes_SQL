import sql from 'mssql';
import { connectMssqlDB } from '../config/db.js'; // Assuming connectMssqlDB now exports the pool directly or an instance

// Function to create a new user
export async function createUser(userData) {
    try {
        const pool = await connectMssqlDB(); // Get the connected pool
        const request = pool.request();
        const result = await request
            .input('name', sql.NVarChar, userData.name)
            .input('email', sql.NVarChar, userData.email)
            .input('password', sql.NVarChar, userData.password)
            .input('avatar', sql.NVarChar, userData.avatar || '')
            .input('mobile', sql.NVarChar, userData.mobile)
            .input('verify_email', sql.Bit, userData.verify_email || false)
            // last_login_date, otp, otpExpires, role will be handled if provided or defaulted by DB
            .query(`INSERT INTO Users (name, email, password, avatar, mobile, verify_email, status, role)
                    VALUES (@name, @email, @password, @avatar, @mobile, @verify_email, 'Active', 'USER');
                    SELECT SCOPE_IDENTITY() as id;`);
        return result.recordset[0].id; // Return the ID of the newly created user
    } catch (err) {
        console.error("Error creating user:", err);
        throw err;
    }
}

// Function to find a user by email
export async function findUserByEmail(email) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');
        return result.recordset[0]; // Returns the first user found or undefined
    } catch (err) {
        console.error("Error finding user by email:", err);
        throw err;
    }
}

// Function to find a user by ID
export async function findUserById(id) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Users WHERE id = @id');
        return result.recordset[0];
    } catch (err) {
        console.error("Error finding user by ID:", err);
        throw err;
    }
}

// Function to update a user by ID
export async function updateUserById(id, updateFields) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        let query = 'UPDATE Users SET ';
        const fields = [];

        // Build the update query dynamically
        for (const key in updateFields) {
            if (updateFields.hasOwnProperty(key)) {
                fields.push(`${key} = @${key}`);
                // Dynamically add input parameters
                if (key === 'password') {
                  request.input(key, sql.NVarChar, updateFields[key]);
                } else if (key === 'verify_email') {
                  request.input(key, sql.Bit, updateFields[key]);
                } else if (key === 'last_login_date' || key === 'otpExpires') {
                  request.input(key, sql.DateTime2, updateFields[key]);
                } else if (key === 'status' || key === 'role' || key === 'otp' || key === 'avatar' || key === 'mobile') {
                  request.input(key, sql.NVarChar, updateFields[key]);
                } else {
                  // Default to NVarChar if type is not explicitly handled
                  request.input(key, sql.NVarChar, updateFields[key]);
                }
            }
        }
        query += fields.join(', ') + ' WHERE id = @id';
        request.input('id', sql.Int, id);

        const result = await request.query(query);

        if (result.rowsAffected[0] > 0) {
            return findUserById(id); // Return the updated user
        }
        return null; // User not found or not updated
    } catch (err) {
        console.error("Error updating user by ID:", err);
        throw err;
    }
}

// Function to count all users
export async function countUsers() {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request.query('SELECT COUNT(*) AS count FROM Users');
        return result.recordset[0].count;
    } catch (err) {
        console.error("Error counting users:", err);
        throw err;
    }
}