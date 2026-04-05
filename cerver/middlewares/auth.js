// middlewares/auth.js
import jwt from "jsonwebtoken";
//backend e routing er jonno
//This is the JWT access token that proves the user is logged in.user je login hoise
//Its main job is to protect certain routes by checking if a user is logged in.
/*
You have some routes that only logged-in users should access, like:
/profile → view profile
/cart → checkout
/update-password → change password
When a request comes to those routes, this auth middleware runs before the route handler.
*/
const auth = (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      //If no token is found → return 401 Unauthorized.
      return res
        .status(401)
        .json({ message: "Token not provided", error: true, success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Access token expired", error: true, success: false });
    }
    return res
      .status(401)
      .json({ message: "Invalid token", error: true, success: false });
  }
};

export default auth;
