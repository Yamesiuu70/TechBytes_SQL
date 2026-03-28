import { sql, connectMssqlDB } from '../config/db.js';

// Function to create a new report
export async function createReport(reportData) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('userId', sql.Int, reportData.userId)
            .input('opinion', sql.NVarChar, reportData.opinion)
            .query(`INSERT INTO Reports (userId, opinion)
                    VALUES (@userId, @opinion);
                    SELECT SCOPE_IDENTITY() as id;`);
        return result.recordset[0].id;
    } catch (err) {
        console.error("Error creating report:", err);
        throw err;
    }
}

// Function to get all reports
export async function getAllReports() {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .query('SELECT * FROM Reports');
        return result.recordset;
    } catch (err) {
        console.error("Error getting all reports:", err);
        throw err;
    }
}

// Function to get a report by ID
export async function getReportById(id) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Reports WHERE id = @id');
        return result.recordset[0];
    } catch (err) {
        console.error("Error getting report by ID:", err);
        throw err;
    }
}
// Function to count all reports
export async function countReports() {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request.query('SELECT COUNT(*) AS count FROM Reports');
        return result.recordset[0].count;
    } catch (err) {
        console.error("Error counting reports:", err);
        throw err;
    }
}
