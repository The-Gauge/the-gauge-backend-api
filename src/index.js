const express= require('express');
const app = express();
const env = require('dotenv');
const mongoose= require('mongoose');
const path = require('path');
const cors = require('cors');

//routes
const adminRoutes = require('./routes/adminRoutes')

// Configure
env.config();
app.use(express.json());

// database connection
const localMongo= `mongodb://localhost/survey`;
//process.env.MONGODB_URI
mongoose.connect(localMongo,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
  }
  ).then(() => {
    console.log('Database Connected');
  });

app.use(cors());  
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use('/api',adminRoutes);


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT} `);
});