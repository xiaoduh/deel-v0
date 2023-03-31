const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      "mongodb+srv://deeladmin:Sfja3tt2xmJBSOJH@deel.hwdezj6.mongodb.net/deel",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("connected to Deel DB");
  } catch (error) {
    console.log("Failed to connect to Deel DB");
    console.log(error);
    process.exit();
  }
};

module.exports = connectDB;
