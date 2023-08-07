// Create a project which have users ( diff types - talent, cd, admin)
// -> signup, login -> DONE
// -> only talent can signup by themselves -> DONE
// ->Cd can’t signup, admin can signup behalf of them and set password for cd ->Done
// -> Project creation can be done by cd ->Done
// -> Admin can update or delete the project (edited)
// Only admin can create CD users and set passwords.
// Project will be created by only CD
// Admin and CD can update and delete the project.

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv").config();
const talentRoutes = require("./routes/talent");
const cdRoutes = require("./routes/cd");
const adminRoutes = require("./routes/admin");
const projectController = require("./controllers/project");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(multer({ storage: storage }).single("cover-file"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/talent", talentRoutes);
app.use("/admin", adminRoutes);
app.use("/cd", cdRoutes);
app.use("/listProject", projectController.getProject);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log(" Database Connected");
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
