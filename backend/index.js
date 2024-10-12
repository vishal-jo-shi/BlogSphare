const express = require('express')
const mongoDB = require('./database/db')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express()
mongoDB();
app.get('/',async(req,res)=>{
      const client = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 20000 // Increase timeout to 20 seconds
    });

      try {
          // Connect to MongoDB
          await client.connect();
          console.log('Connected to MongoDB');

          // Access the database
          const db = client.db('mydatabase'); // Specify your database name here

          // Access collections
          const blogsCollection = db.collection("blogs");
          const blogsCatCollection = db.collection("blog_category");
          const commentsCollection = db.collection("comments");
          const [blogs, blogsCat, blogsCmt] = await Promise.all([
            blogsCollection.find().toArray(),
            blogsCatCollection.find().toArray(),
            commentsCollection.find().toArray()
        ]);
          res.status(200).json({blog:blogs,cateory:blogsCat,comment:blogsCmt})
      }catch(err){
        console.error('Connection or collection access failed:', err.message);
        res.status(500).json(err)
      }
})
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", `${process.env.FRONTEND_URL}`);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  
  app.use(express.json())
  app.use(express.urlencoded({ extended: true })); 
  app.use('/api',require("./Routes/CreateUser"))
  app.use('/api',require("./Routes/DisplayBlogs"))
  app.use('/api',require("./Routes/DisplayComment"))
  app.use('/api',require("./Routes/DisplayProfiles"))
  app.use('/api',require("./middleware/uploads"))
  app.use('/images', express.static('uploads'));

  // module.exports = app;
  app.listen(process.env.PORT,()=>{
    console.log(`App listining on port ${process.env.PORT}`)
})

