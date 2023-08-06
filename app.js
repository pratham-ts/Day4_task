// Create a project which have users ( diff types - talent, cd, admin)
// -> signup, login -> DONE
// -> only talent can signup by themselves -> DONE
// ->Cd can’t signup, admin can signup behalf of them and set password for cd
// -> Project creation can be done by cd
// -> Admin can update or delete the project (edited) 



// Only admin can create CD users and set passwords.
// Project will be created by only CD
// Admin and CD can update and delete the project.

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const userRoutes = require('./routes/users')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use('/talent', userRoutes)
app.use(userRoutes)

mongoose.connect('mongodb+srv://pratham:c0At7haKCjB2wKq7@cluster0.hfa5lw3.mongodb.net/CN')
.then(()=>{
    console.log(' Database Connected');
    app.listen(3000)
})
.catch((err)=>{
    console.log(err);
})
