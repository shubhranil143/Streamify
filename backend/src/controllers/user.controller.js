import User from "../models/user.model.js";
import FriendRequest from "../models/FriendRequest.js";
// Discover potential language exchange partners
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;
        const friendsList = Array.isArray(currentUser.friends) ? currentUser.friends : [];

        // Query criteria:
        // 1. $ne: Exclude the logged-in user themselves
        // 2. $nin: Exclude users who are already in currentUser.friends array
        // 3. isOnboarded: Only return users who have completed their language profile
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: friendsList } },
                { isOnboarded: true }
            ]
        });
        res.status(200).json(recommendedUsers || []);
    } catch (error) {
        console.error("Error fetching recommended users:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Fetch current user's friends with populated profile details
export async function getMyFriends(req, res) {
    try {
        // .populate() replaces ObjectIds with actual User documents (similar to a SQL JOIN)
        const user = await User.findById(req.user._id)
            .select("friends")
            .populate("friends", "fullName profilePicture nativeLanguage learningLanguage location");

        const friends = Array.isArray(user?.friends) ? user.friends.filter(Boolean) : [];
        res.status(200).json(friends);
    } catch (error) {
        console.error("Error fetching friends:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Send a friend request to another user
export async function sendFriendRequest(req, res) { 
    try {
        const myId = req.user._id;
        const recipientId = req.params.id;

        // Prevent users from sending requests to themselves
        if (myId.toString() === recipientId.toString()) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient user not found" });
        }

        // Check if users are already friends
        const recipientFriends = Array.isArray(recipient.friends) ? recipient.friends : [];
        if (recipientFriends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // Prevent duplicate friend requests in either direction (sender -> recipient or recipient -> sender)
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        const friendRequest = await FriendRequest.create({ sender: myId, recipient: recipientId });
        res.status(201).json({ message: "Friend request sent successfully", friendRequest });
    } catch (error) {
        console.error("Error sending friend request:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Accept an incoming friend request
export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Authorization check: only the recipient can accept this request
        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();
        
        // Atomically add each user to the other's friends array ($addToSet prevents duplicate IDs)
        await User.findByIdAndUpdate(friendRequest.sender, { $addToSet: { friends: friendRequest.recipient } });
        await User.findByIdAndUpdate(friendRequest.recipient, { $addToSet: { friends: friendRequest.sender } });

        res.status(200).json({ message: "Friend request accepted successfully" });
    } catch (error) {
        console.error("Error accepting friend request:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Fetch incoming pending requests and accepted notification alerts for current user
export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({ recipient: req.user._id, status: "pending" })
            .populate("sender", "fullName profilePicture nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({ recipient: req.user._id, status: "accepted" })
            .populate("sender", "fullName profilePicture nativeLanguage learningLanguage");

        res.status(200).json({
            incomingReqs: Array.isArray(incomingReqs) ? incomingReqs.filter(r => r.sender) : [],
            acceptedReqs: Array.isArray(acceptedReqs) ? acceptedReqs.filter(r => r.sender) : []
        });
    } catch (error) {
        console.error("Error fetching friend requests:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Fetch outgoing pending requests sent by current user (used to disable "Send Request" buttons in UI)
export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingReqs = await FriendRequest.find({ sender: req.user._id, status: "pending" })
            .populate("recipient", "fullName profilePicture nativeLanguage learningLanguage");

        res.status(200).json(Array.isArray(outgoingReqs) ? outgoingReqs.filter(r => r.recipient) : []);
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
