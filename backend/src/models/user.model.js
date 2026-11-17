import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema: handles authentication, language exchange profile data, and friendships
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true // Unique index prevents duplicate registrations
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    nativeLanguage: {
        type: String,
        default: ""
    },
    learningLanguage: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    isOnboarded: {
        type: Boolean,
        default: false // Used by frontend route guards to redirect incomplete profiles to /onboarding
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Stores references to other User documents
    }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Pre-save hook: automatically hash password using bcrypt before saving to MongoDB
userSchema.pre("save", async function (next) {
    // Only hash if the password field was modified (prevents re-hashing when updating bio/profile)
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Custom schema method to securely compare entered plain password against stored bcrypt hash
userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordMatch = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordMatch;
};

const User = mongoose.model("User", userSchema);

export default User;