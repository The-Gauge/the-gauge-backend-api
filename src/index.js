const express= require('express');
const app = express();
const env = require('dotenv');
const mongoose= require('mongoose');
const path = require('path');
const cors = require('cors');

//routes
const categoryRoutes = require('./routes/catergory');
const adminRoutes = require('./routes/adminRoutes')
const articleRoutes = require('./routes/article');

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

app.use(cors());  
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use('/api',adminRoutes);
app.use('/api',categoryRoutes);
app.use('/api',articleRoutes);

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT} `);
});