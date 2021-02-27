const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ "admin", "super-admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

// userSchema.virtual('password')
// .set(function(password){
//     this.hash_password = bcrypt.hashSync(password, 10);
// });

adminSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

adminSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};

module.exports = mongoose.model("Admin", adminSchema);