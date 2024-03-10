import User from '../models/userModel.js';

import bcrypt from 'bcryptjs';
import generateTokenAndSetCookies from '../utils/helpers/generateTokenAndSetCookies.js';

const getUserProfile = async (req, res) => {

    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select("-password").select("-updatedAt");
        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in getUserProfile: ", error.message);
    }
};

const signupUser = async (req, res) => {
    try {   
        const { username, email, password } = req.body;
        
        // Corrected: Use 'User' instead of 'user' for the model variable to match the import and avoid case sensitivity issues
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Corrected: Use 'User' to create a new instance
        const newUser = new User({
            username, 
            email, 
            password: hashedPassword,
            // profilepic, followers, following, bio - Assuming these are part of your User model, ensure they are handled appropriately (either by setting defaults in the model or including them here if they are being passed in the request)
        });

        await newUser.save();

        
        if (newUser) {

            generateTokenAndSetCookies(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                // Optionally include other fields you wish to return
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateTokenAndSetCookies(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            // Optionally include other fields you wish to return
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in loginUser: ", error.message);
    }
};

const logoutUser = async (req, res) => {

    try {
        res.cookie("jwt","", {maxAge: 1});
        res.status(200).json({ message: "User logged out" });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in logoutUser: ", err.message);
        
    }



};

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id) {
            return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing) {
            // Correct the logic to remove the target user from the currentUser's following list
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            // Correct the logic to remove the currentUser from the target user's followers list
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            res.status(200).json({ message: "Unfollowed user" });
        } else {
            // Correct the logic to add the target user to the currentUser's following list
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            // Correct the logic to add the currentUser to the target user's followers list
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            res.status(200).json({ message: "Followed user" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in followUnfollowUser: ", error.message);
    }
};

const updateUser = async (req, res) => {
    const { username, email, password, profilepic, bio } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

     

        // Hash new password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword; // Update password directly on the found user object
        }

        // Update user fields if provided, else keep the current value
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilepic = profilepic || user.profilepic;
        user.bio = bio || user.bio;

        // Since user is a Mongoose document here, you can just call save() to apply the updates
        await user.save();

        // Optionally, exclude the password when returning the updated user
        

        res.status(200).json({ message: "User updated", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in updateUser: ", error.message);
    }
};


export { getUserProfile, signupUser, loginUser, logoutUser, followUnfollowUser, updateUser };