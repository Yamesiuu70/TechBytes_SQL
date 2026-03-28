// controllers/report.controller.js
import { createReport } from "../utils/report.db.js";
//Imports the Report model to save reports in the database.

export const createReportController = async (req, res) => {
  //Exports an async controller function to handle creating reports.
  try {
    const { opinion } = req.body;
    //Extracts opinion from the request body.
    const userId = req.userId;
//Gets userId from req.userId (assumes user is authenticated)


    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
      //Checks if the user is logged in.If not, sends 401 Unauthorized.
    }

    if (!opinion || opinion.trim() === "") {
      return res.status(400).json({ message: "Opinion is required" });
    }

    const newReport = await createReport({ userId, opinion });
    //Creates a new report in the database with the user ID and opinion.

    return res.status(201).json({
      message: "Report submitted successfully",
      report: newReport,
      //Sends a 201 Created response with a success message and the new report.
    });
  } catch (error) {
    console.error("Report creation error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      //If anything goes wrong, logs the error and sends a 500 Internal Server Error response.
    });
  }
};
