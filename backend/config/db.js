const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to Deel DB");
  } catch (error) {
    console.log("Failed to connect to Deel DB");
    console.log(error);
    process.exit();
  }
};

module.exports = connectDB;
