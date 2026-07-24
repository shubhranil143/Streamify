import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Missing Stream API key or secret in environment variables");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async(userData) => {
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error occurred while upserting Stream user:", error);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    if (!userId) throw new Error('userId is required to generate stream token');
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error('Error generating stream token:', error);
        throw error;
    }
};