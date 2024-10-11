const express = require('express')
const router = express.Router()
const Profile = require('../models/Profile');
const mongoDB = require('../database/db')
const path = require('path');
const fs = require('fs');
router.post('/usersprofile', async (req, res) => {
    try {
        await mongoDB(); // Ensure the database connection is established
        const email = req.body.email;
        const profiles = await Profile.find({ email: { $ne: email } }); // Fetch all profiles except the one with the specified email
        res.json(profiles); // Send the filtered profiles back as a response
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/myprofiledata', async (req, res) => {
    try {
        mongoDB(); // Connect to your database
        const email  = req.body.email; // Get the email from the request body

        if (!email) {
            return res.status(400).json({ message: "email is required" }); // Handle missing email
        }
        // Find profile with the email
        const profile = await Profile.find({ email: email });
        res.json(profile); // Send the profile back as a response
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/updateprofile', async (req, res) => {
    try {
        const { email, data } = req.body; // Destructure email and data from request body       
        // Validate that email and data exist
        if (!email || !data) {
            return res.status(400).json({ message: "Email and data are required" });
        }

        // Find the profile by email to retrieve the current profile data
        const existingProfile = await Profile.findOne({ email });
        if (!existingProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Check if the profile picture is changing
        if (existingProfile.profilePic && data.profilePic && existingProfile.profilePic !== data.profilePic) {
            const oldImgPath = path.join(__dirname, '../uploads', email, existingProfile.profilePic.split('/').pop());
            fs.unlink(oldImgPath, (err) => {
                if (err) {
                    console.error('Error deleting old profile picture:', err);
                }
            });
        }

        // Check if the fields are provided in data, otherwise leave them unchanged
        const updatedFields = {};
        if (data.username) updatedFields.username = data.username;
        if (data.bio) updatedFields.bio = data.bio;
        if (data.profilePic) updatedFields.profilePic = data.profilePic;

        // Update only the provided fields
        const updatedProfile = await Profile.findOneAndUpdate(
            { email: email },
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile update failed" });
        }

        // Send success response with the updated profile
        res.json({ success: true, profile: updatedProfile });
    } catch (error) {
        console.error('Error in updateprofile:', error); // Log the error
        res.status(500).send("Server Error");
    }
});



router.post('/followfollowing', async (req, res) => {
    try {
        const { currentUserEmail, profileUserEmail, isFollowing } = req.body;

        // Find the current user and profile user
        const currentUser = await Profile.findOne({ email: currentUserEmail });
        const profileUser = await Profile.findOne({ email: profileUserEmail });

        // Check if both users exist
        if (!currentUser || !profileUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (isFollowing) {
            // Unfollow logic
            currentUser.following = currentUser.following.filter(email => email !== profileUserEmail);
            profileUser.follower = profileUser.follower.filter(email => email !== currentUserEmail);
            await currentUser.save();
            await profileUser.save();
            return res.json({ isFollowing: false });
        } else {
            // Follow logic
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
      const profiles = await Profile.find({ email: { $in: emails } }); // Fetch profiles based on emails

      res.json(profiles);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  router.post('/followerProfiles', async (req, res) => {
    const { emails } = req.body;
    try {
      const profiles = await Profile.find({ email: { $in: emails } }); // Fetch profiles based on emails

      res.json(profiles);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });


module.exports = router