const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    user_type: {
      type: String,
      required: true,
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
      max: 10,
      minlength: 10,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    lead_bought: {
      type: [String],
    },
    nb_lead: {
      type: Number,
      default: 0,
    },
    coin: {
      type: String,
      default: 0,
    },
    solde: {
      type: String,
      default: 0,
    },
    review: {
      type: [Number],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSales: {
      type: Boolean,
    },
    isBusinessProvider: {
      type: Boolean,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    twoFA: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into db

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("inccorect email");
};

module.exports = mongoose.model("user", userSchema);
