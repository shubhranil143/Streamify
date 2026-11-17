import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to guard protected routes by validating JWT from HTTP-only cookie
export const protectRoute = async (req, res, next) => {
    try {
        // Read the JWT stored in the HTTP-only cookie
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify token signature against the server's secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // Find user in DB and exclude password hash from the retrieved document
        const user = await User.findById(decoded.userID).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        // Attach user to request object so downstream controllers can access req.user
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
