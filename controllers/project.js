const Project = require('../models/project')

exports.createProject = async(req,res)=>{
    try{
    const{body:{title,description}}=req
    if(!title || !description) throw Error('Title or Description cannot be Empty')
    const newProject = new Project({title,description})
    newProject.save()
    return res.send({status:'success', message:'Project added'})
    }catch(e){
        return res.status(403).send({status:'failed', message:e.message})
    }
}