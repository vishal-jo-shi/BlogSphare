const express = require('express')
const mongoDB = require('./database/db')
require('dotenv').config();
const app = express()

app.get('/', (req, res) => {
  try {
    // Your logic here
    res.send('Hello, World!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
mongoDB();


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

  module.exports = app;