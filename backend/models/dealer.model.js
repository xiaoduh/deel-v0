const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const dealerSchema = mongoose.Schema(
  {
    dealer_username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      unique: true,
      trim: true,
    },
    first_name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      max: 10,
      minlength: 10,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    deal: {
      type: [String],
    },
    coin: {
      type: Number,
      default: 0,
    },
    isDealer: {
      type: Boolean,
      default: true,
    },
    nb_lead: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into db

dealerSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

dealerSchema.statics.login = async function (email, password) {
  const dealer = await this.findOne({ email });
  if (dealer) {
    const auth = await bcrypt.compare(password, dealer.password);
    if (auth) {
      return dealer;
    }
    throw Error("incorrect password");
  }
  throw Error("inccorect email");
};

module.exports = mongoose.model("dealer", dealerSchema);
