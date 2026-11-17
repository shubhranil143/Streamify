import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Missing Stream API key or secret in environment variables");
}

// Server-side Stream client initialized with admin secret (never exposed to frontend)
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Sync user profile to Stream servers (creates or updates user in Stream database)
export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error occurred while upserting Stream user:", error);
        throw error;
    }
};

// Generate a signed JWT token using Stream secret so the client can securely connect directly to Stream's WebSocket CDN
export const generateStreamToken = (userId) => {
    if (!userId) throw new Error('userId is required to generate stream token');
    try {
        const userIdStr = userId.toString();
        // createToken signs the user ID with STREAM_API_SECRET
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error('Error generating stream token:', error);
        throw error;
    }
};