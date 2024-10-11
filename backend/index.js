const express = require('express')
const {mongoDB} = require('./database/db')
require('dotenv').config();
const app = express()
const { fetchBlogs, fetchCategories, fetchComments } = require('./database/fetchData');

mongoDB();
app.get('/',(req,res)=>{
    res.send("Hello Worldd!")
})
const router = express.Router();
//testing
router.get('/blogs', async (req, res) => {
  try {
      const blogs = await fetchBlogs();
      res.json(blogs);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching blogs', error });
  }
});

router.get('/categories', async (req, res) => {
  try {
      const categories = await fetchCategories();
      res.json(categories);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error });
  }
});

router.get('/comments', async (req, res) => {
  try {
      const comments = await fetchComments();
      res.json(comments);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error });
  }
});
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
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
  
app.listen(process.env.PORT,()=>{
    console.log(`App listining on port ${process.env.PORT}`)
})
