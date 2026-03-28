import { createHelp } from "../utils/help.db.js";
//Imports the Help model from Mongoose.
//This model represents the help collection in your MongoDB database
//help funtionality er jonno help 
export const submitHelp = async (req, res) => {
  // /It takes req (request) and res (response) as parameters
  try {
    const { email, message } = req.body;
    //Extracts email and message from the request body (data sent by the user).

    if (!email || !message) {
      //Checks if either email or message is missing.email message duitai dise kina 
      //If yes, sends a 400 Bad Request response with an error message.
      return res.status(400).json({ 
        success: false, 
        message: "Email and message are required" 
      });
    }

    const newHelp = await createHelp({ email, message });
    //Creates a new document in the help collection with the given email and message.
    //Waits for it to be saved in the database.

    res.status(201).json({
/*
Sends a 201 Created response with:
success: true
Confirmation message
The newly created help document (newHelp) 
*/

      success: true,//jinishta kaj hosie 
      message: "Help request submitted successfully",
      data: newHelp
    });
  } catch (error) {
    console.error("Help submission error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
    //If anything goes wrong, it logs the error and sends a 500 Internal Server Error response
  }
};
