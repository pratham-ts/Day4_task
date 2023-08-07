const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  const {
    body: { email, password, userType },
  } = req;
  if (!email || !password)
    return res
      .status(422)
      .send({ status: "failed", message: "Email or Password is empty" });
  try {
    const user = await User.findOne({ email });
    if (user) throw Error("User already existed");
    const newUser = new User({ email, password, userType });
    const result = await newUser.save();
    if (!result) throw Error("Unable to add user");
    res.send({ status: "success", message: "user added" });
  } catch (e) {
    return res.status(403).send({ status: "failed", message: e.message });
  }
};

exports.signIn = async (req, res) => {
  const{email, password}= req.body
  if (!email || !password) {
    return res
      .status(422)
      .send({ status: "failed", message: "email or password is empty" });
  }
  try {
    const currUser = await User.findOne({ email: email.toLowerCase() });
    if (!currUser) throw Error("User not registered");
    const result = await bcrypt.compare(password, currUser.password);
    if (!result) throw Error("Invalid Username or Password");
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { email: currUser.email, userType: currUser.userType },
      },
      "1234"
    );
    return res.send({
      status: "success",
      message: "Logged in Sucessfully",
      token,
    });
  } catch (e) {
    return res.status(403).send({ status: "failed", message: e.message });
  }
};
