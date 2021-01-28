const express= require('express');
const app = express();
const env = require('dotenv');
const mongoose= require('mongoose');
const path = require('path');
const cors= require('cors');

// Configure
env.config();
app.use(express.json());


// database connection
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
  }
  ).then(() => {
    console.log('Database Connected');
  });


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT} `);
});