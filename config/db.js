const config = require("config");
const mongoose = require("mongoose");
const db = config.get("mongoUri");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify : false
    });
    console.log("MongoDb connected");
  } catch (err) {
    console.log(err.message);
    //exit applicayion

    process.exit(1);
  }
};

module.exports = connectDB;
