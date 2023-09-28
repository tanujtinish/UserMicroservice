const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require("mongoose");

const mongodb_uri = process.env.MONGODB_URI

mongoose.connect(mongodb_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

