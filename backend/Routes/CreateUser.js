const express = require('express')
const router = express()
const User = require("../models/User")
const Profile = require("../models/Profile");
const {body,validationResult} = require('express-validator')
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 


router.post('/createuser', [
    body('email', 'Incorrect Email').isEmail(),
    body('name', 'Minimum length should be 5').optional().isLength({ min: 5 }),
    body('password', 'Incorrect Password').optional().isLength({ min: 5 }),
    body('username', 'Invalid Username').optional().isLength({ min: 5 })
], async (req, res) => {
    // Check for validation errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    try {
        // Check if a user with the same email already exists
        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.json({ success: false, error: "This email is already registered" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);

        // Create the new user
        const user = await User.create({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            password: secPassword,
        });

        // Create a new profile for the user
        await Profile.create({
            email: user.email,
            username: user.username,
            bio: '',
            profilePic: 'http://localhost:3000/Image/default_profile.jpeg',
            blogs: [],
            follower: [],
            following: []
        });

        // Send success response
        res.json({ success: true });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});



router.post('/loginuser',[
    body('email','Incorrect Email').isEmail(),
    body('password','Incorrect Password').optional().isLength({ min: 5 })
],async(req,res)=>{
    
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    let email = req.body.email;
    try {
        let userData = await User.findOne({email});
       if(!userData){
            return res.status(400).json({error:"Try login with correct Email"})
       } 
        const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
       if(!pwdCompare){
            return res.status(400).json({error:"Try login with correct Password"})
       }

       const data = {
            user:{
                id:userData.id
            }
       }
       const authToken = jwt.sign(data,process.env.JWT_SECRET)
        res.json({success:true,authToken:authToken})
    } catch (error) {
        console.log(error)
    }
})

router.post('/username',async(req,res)=>{
    let email = req.body.email;
    try {
        let userData = await User.findOne({email});
        res.send({username:userData.username})
    } catch (error) {
        console.log(error)
    }
})

module.exports = router