import express from "express"
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";   
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";



const app = express();
const PORT = process.env.PORT;

// Enable CORS with credentials so HTTP-only auth cookies can be sent from the Vite frontend (port 5173)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true, // Allows browser to include cookies in cross-origin requests
  })
);

// Middleware to parse incoming JSON request bodies into req.body
app.use(express.json());

// Middleware to parse cookies from headers into req.cookies (needed for JWT auth)
app.use(cookieParser());

// Route definitions - modular separation of concerns
app.use("/api/auth", authRoutes); // Auth & onboarding endpoints
app.use("/api/users", userRoutes); // Friend requests & user discovery
app.use("/api/chat", chatRoutes);  // Stream chat token generation

// Start HTTP server and connect to MongoDB database
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
