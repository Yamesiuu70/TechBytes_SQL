import { sql, connectMssqlDB } from '../config/db.js';

// Function to create a new help request
export async function createHelpRequest(helpData) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('email', sql.NVarChar, helpData.email)
            .input('message', sql.NVarChar, helpData.message)
            .query(`INSERT INTO Helps (email, message)
                    VALUES (@email, @message);
                    SELECT SCOPE_IDENTITY() as id;`);
        return result.recordset[0].id;
    } catch (err) {
        console.error("Error creating help request:", err);
        throw err;
    }
}

// Function to get all help requests
export async function getAllHelpRequests() {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .query('SELECT * FROM Helps');
        return result.recordset;
    } catch (err) {
        console.error("Error getting all help requests:", err);
        throw err;
    }
}

// Function to get a help request by ID
export async function getHelpRequestById(id) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Helps WHERE id = @id');
        return result.recordset[0];
    } catch (err) {
        console.error("Error getting help request by ID:", err);
        throw err;
    }
}
// Function to count all help requests
export async function countHelpRequests() {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request.query('SELECT COUNT(*) AS count FROM Helps');
        return result.recordset[0].count;
    } catch (err) {
        console.error("Error counting help requests:", err);
        throw err;
    }
}
