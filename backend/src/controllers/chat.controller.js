import { generateStreamToken } from "../lib/stream.js";

// Endpoint that returns a signed Stream token for the authenticated user (called by ChatPage & CallPage)
export async function getStreamToken(req, res) {
    try {
        // Mint token using authenticated user's ID
        const token = generateStreamToken(req.user.id);
        res.status(200).json({ token });  
    } catch (error) {
        console.error("Error generating stream token:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}