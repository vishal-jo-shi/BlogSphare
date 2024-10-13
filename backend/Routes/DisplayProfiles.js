const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const clientPromise = require('../database/db');
const cloudinary = require('cloudinary').v2; // Import Cloudinary

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Set your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // Set your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET   // Set your Cloudinary API secret
});

router.post('/usersprofile', async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const mongoClient = await clientPromise;
        const db = mongoClient.db('mydatabase');
        const profilesCollection = db.collection("profiles");
        const email = req.body.email;

        let profiles
        if (email) {
            profiles = await profilesCollection.find({ email: { $ne: email } }).toArray();
        } else {
            profiles = await profilesCollection.find({}).toArray(); // Fetch all profiles if no email
        }
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

router.post('/myprofiledata', async (req, res) => {
    try {
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const profile = await Profile.find({ email: email });
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/updateprofile', async (req, res) => {
    try {
        const { email, data } = req.body;

        if (!email || !data) {
            return res.status(400).json({ message: "Email and data are required" });
        }

        const existingProfile = await Profile.findOne({ email });
        if (!existingProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const updatedFields = {};
        if (data.username) updatedFields.username = data.username;
        if (data.bio) updatedFields.bio = data.bio;
        if (data.profilePic) updatedFields.profilePic = data.profilePic;


        const updatedProfile = await Profile.findOneAndUpdate(
            { email: email },
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile update failed" });
        }

        res.json({ success: true, profile: updatedProfile });
    } catch (error) {
        console.error('Error in updateprofile:', error);
        res.status(500).send("Server Error");
    }
});

router.post('/followfollowing', async (req, res) => {
    try {
        const { currentUserEmail, profileUserEmail, isFollowing } = req.body;

        const currentUser = await Profile.findOne({ email: currentUserEmail });
        const profileUser = await Profile.findOne({ email: profileUserEmail });

        if (!currentUser || !profileUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(email => email !== profileUserEmail);
            profileUser.follower = profileUser.follower.filter(email => email !== currentUserEmail);
            await currentUser.save();
            await profileUser.save();
            return res.json({ isFollowing: false });
        } else {
            currentUser.following.push(profileUserEmail);
            profileUser.follower.push(currentUserEmail);
            await currentUser.save();
            await profileUser.save();
            return res.json({ isFollowing: true });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/followingProfiles', async (req, res) => {
    const { emails } = req.body;
    try {
        const profiles = await Profile.find({ email: { $in: emails } });
        res.json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/followerProfiles', async (req, res) => {
    const { emails } = req.body;
    try {
        const profiles = await Profile.find({ email: { $in: emails } });
        res.json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
