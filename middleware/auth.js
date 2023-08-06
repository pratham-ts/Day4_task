const jwt = require('jsonwebtoken')

module.exports = async (req,res,next)=>{
    try{
    let token = req.get('Authorization')
    if(!token) throw Error('Not authenticated')
    token= token.split(' ')[1]
    let decodedToken = await jwt.verify(token, '1234')
    req.userType = decodedToken.data.userType
    next()
    }
    catch(e){
        res.status(503).send({status:'failed', message:e.message})
    }
}