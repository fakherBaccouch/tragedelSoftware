const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

// maxAge for token :
const maxAge = 3 * 24 * 60 * 60 * 1000;

//function to creat a token :
const createToken = (id) => {
  return jwt.sign({id}, process.env.TOKEN_SECRET, {
    expiresIn: maxAge
  })
};

//signup controller :
module.exports.signUp = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password} = req.body
  try {
    const user = await UserModel.create({
      firstName,
      lastName, 
      username,
      email, 
      password,
      projects:[],
      filesUp:[],
      filesDown:[] });
    res.status(201).json({ user: user});
  }
  catch(err) {
    const errors = signUpErrors(err);
    res.status(200).send({ errors })
  }
}

//signin controller :
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body
  console.log(email);
  try {
    const user = await UserModel.login(email, password);
    const token =  createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge});
    console.log(token);
    res.status(200).json({ user: user._id})
  } catch (err){
    const errors = signInErrors(err);
    res.status(200).json({ errors });
  }
}

//logout controller :
module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}