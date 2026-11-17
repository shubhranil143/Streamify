import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Handles new user registration, initial avatar creation, Stream user sync, and JWT cookie issuance
export async function signup(req, res) {
    const { email, password, fullName } = req.body;
    try {
        // Validate required fields
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "Please provide email, password, and full name" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, please use a different email" });
        }

        // Generate a deterministic default SVG avatar using Dicebear initials API
        const randomAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${fullName}`;
        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePicture: randomAvatar,
        });

        // Sync new user with Stream Chat server so they can chat and call immediately
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePicture || "",
            });
            console.log(`Stream user created for ${newUser._id}`);
        } catch (error) {
            console.error('Error creating Stream user:', error);
        }

        // Sign JWT and set HTTP-only cookie:
        // - httpOnly: prevents client-side JS from reading cookie (mitigates XSS)
        // - sameSite: "strict" prevents browser from sending cookie in cross-site requests (mitigates CSRF)
        // - secure: ensures cookie is only sent over HTTPS in production
        const token = jwt.sign({ userID: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7days" });
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        console.log("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Authenticates existing user by email & password and sets JWT cookie
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user by unique email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare entered password with stored bcrypt hash
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Issue JWT cookie on successful credentials check
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7days" });
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error during login:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Clears JWT cookie to log user out
export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

// Completes user profile after signup (native & learning languages, bio, location)
export async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        // Ensure all required onboarding fields are provided
        const missingFields = [];
        if (!fullName) missingFields.push('fullName');
        if (!bio) missingFields.push('bio');
        if (!nativeLanguage) missingFields.push('nativeLanguage');
        if (!learningLanguage) missingFields.push('learningLanguage');
        if (!location) missingFields.push('location');

        if (missingFields.length) {
            return res.status(400).json({
                message: "All fields are required for onboarding",
                missingFields,
            });
        }

        // Update user record and flag isOnboarded: true
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, bio, nativeLanguage, learningLanguage, location, isOnboarded: true },
            { new: true } // Return updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sync updated profile details with Stream Chat
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePicture || "",
            });
            console.log(`Stream user updated for ${updatedUser._id}`);
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding:", streamError.message);
        }

        res.status(200).json({ success: true, message: "Onboarding completed successfully", user: updatedUser });
    } catch (error) {
        console.error("Error during onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
