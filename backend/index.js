const express = require('express')
const mongoDB = require('./database/db')
const app = express()
mongoDB();
app.get('/',(req,res)=>{
    res.send("Hello Worldd!")
})

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
