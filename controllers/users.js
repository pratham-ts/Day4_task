const User = require("../models/users");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

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
  const { email, password } = req.body;
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
      process.env.SECRET_KEY
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

exports.updateMobileNumber = async (req, res, next) => {
  try {
    const {
      body: { phoneNumber, uid, countryCode },
    } = req;
    if (!uid) throw Error("User Id is necessary");
    if (!phoneNumber) throw Error("Please enter a phone number");
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const msg = await client.messages.create({
      body: `Your Otp is ${otp}`,
      from: "+12294695936",
      to: `${countryCode}${phoneNumber}`,
    });
    const user = await User.findOne({ _id: uid });
    if (msg) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 2,
          data: { otp },
        },
        process.env.SECRET_KEY
      );
      console.log(token);
      await user.save();
      return res.send({ status: "sucess", message: user });
    }
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};

exports.verifyMobileNumber = async (req, res, next) => {
  try {
    const {
      body: { otp, uid, phoneNumber, token, countryCode },
    } = req;
    if (!otp) throw Error("otp is necessary");
    const user = await User.findOne({ _id: uid });
    let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (otp !== decodedToken.data.otp) throw Error("Otp is invalid");
    user.phoneNumber = phoneNumber;
    user.countryCode = countryCode;
    await user.save();
    return res.send({ status: "sucess", message: user });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};
