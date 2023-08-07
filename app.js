// Create a project which have users ( diff types - talent, cd, admin)
// -> signup, login -> DONE
// -> only talent can signup by themselves -> DONE
// ->Cd can’t signup, admin can signup behalf of them and set password for cd ->Done
// -> Project creation can be done by cd ->Done
// -> Admin can update or delete the project (edited) 



// Only admin can create CD users and set passwords.
// Project will be created by only CD
// Admin and CD can update and delete the project.

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const auth = require('./middleware/auth')
const talentRoutes = require('./routes/talent')
const cdRoutes = require('./routes/cd')
const adminRoutes = require('./routes/admin')
const projectController = require('./controllers/project')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/talent',talentRoutes)
app.use('/admin', adminRoutes)
app.use('/cd',cdRoutes)
app.use('/',projectController.getProject)

mongoose.connect('mongodb+srv://pratham:c0At7haKCjB2wKq7@cluster0.hfa5lw3.mongodb.net/CN')
.then(()=>{
    console.log(' Database Connected');
    app.listen(3000)
})
.catch((err)=>{
    console.log(err);
})
