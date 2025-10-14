
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String },
//   email: { type: String, required: true, unique: true },
//   role: { type: String, default: "user" },
//   isAdmin: { type: Boolean, default: false },
//   otp: { type: String },
//   otpExpires: { type: Date }
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   name: { type: String },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isAdmin: { type: Boolean, default: false },
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function(next){
//   if(!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare password
// userSchema.methods.matchPassword = async function(enteredPassword){
//   return await bcrypt.compare(enteredPassword, this.password);
// }

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);


