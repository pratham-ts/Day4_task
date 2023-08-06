const User = require("../models/users");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.signUp = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  if (!email || !password)
    return res.status(422).send({ status: "failed", message: "Email or Password is empty" });
  try {
    const user = User.findOne({email: email.toLowerCase()})
    if(user) throw Error('User already existed')
    const newUser = new User({ email, password });
    const result = await newUser.save();
    if(!result) throw Error ('Unable to add user')
    res.send({ status: "success", message: "user added" });
  } catch (e) {
    return res.status(403).send({status:'failed', message: e.message})
  }
};

exports.signIn = async(req,res)=>{
    const{
        body:{email, password}
    }=req
    if(!email || !password)
        return res
                .status(422)
                .send({status: 'failed', message: 'email or password is empty'})
    try{
    const currUser = await User.findOne({email:email.toLowerCase()})
    const result = await bcrypt.compare(password, currUser.password)
    if(!result) throw Error ('Invalid Username or Password')
    const token = jwt.sign({ email: currUser.email, userType: currUser.userType }, '1234');
    console.log(token);
    return res.send({status:'success', message: 'Logged In Successfully'})
    }catch(e){
        return res.status(403).send({status:'failed', message:e.message})
    }
    
}
