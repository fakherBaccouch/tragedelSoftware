const mongoose = require('mongoose');
// validator : to verifie the email with the function is Email :
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
// User Schema :
const userSchema = new mongoose.Schema(
  {
    firstName: {type: String,required: true,min: 3,max: 20},
    lastName:  {type: String,required: true,min: 3,max: 20},
    username:  {type: String,required: true},
    email:     {type: String,required: true,validate: [isEmail],lowercase: true,unique: true,trim: true},
    password:  {type: String,required: true,max: 1024,minlength: 6},
    role:      {type: String,enum: ["user", "admin", "super-admin"],default: "user"},
    contact:   { type: String,default:"00000000" },
    picture:   {type: String ,default: "./uploads/profil/random-user.png"},
    projects : [{project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project'}}],
    filesUp  : [{file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },date: Date}],
    filesDown: [{file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },date: Date}]
  },
  { timestamps: true }
);

// hash the password before save the user :
userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// compare the password before login :
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};
// export the Schema :
module.exports = mongoose.model("User", userSchema);;