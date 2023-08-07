const Project = require("../models/project");
const path = require("path");
const { all } = require("../routes/talent");

exports.createProject = async (req, res) => {
  try {
    // if (req.userType !== "cd") throw Error("Only CD can add project");
    const {
      body: { title, description },
    } = req;
    if (!title || !description)
      throw Error("Title or Description cannot be Empty");
    const file = req.file;
    if (!file) throw Error("Cover File not Uploaded");
    const newProject = new Project({
      title,
      description,
      coverFilePath: file.path,
    });
    newProject.save();
    return res.send({
      status: "success",
      message: "Project added",
      data: newProject,
    });
  } catch (e) {
    return res.status(403).send({ status: "failed", message: e.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    if (req.userType === "talent")
      throw Error("Only CD or Admin can edit project");
    const {
      params: { id },
    } = req;
    const project = await Project.findById(id);
    if (!project) throw Error("Project doesnot exists");
    const {
      body: { title, description },
    } = req;
    if (!title || !description) throw Error("Please provide updated value");
    console.log(project);
    project.title = title;
    const result = await project.save();
    if (!result) throw Error("Unable to update project");
    return res.send({ status: "success", message: project });
  } catch (e) {
    return res.status(502).send({ status: "failed", message: e.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    if (req.userType === "talent")
      throw Error("Only CD or admin can delete project");
    const {
      params: { id },
    } = req;
    const project = Project.findById(id);
    if (!project) throw Error("Project does not exists");
    const result = await Project.deleteOne(project);
    if (!result) throw Error("Unable to delete project");
    return res.send({ status: "success", message: "Project Deleted" });
  } catch (e) {
    res.status(503).send({ status: "failed", message: e.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const allProjects = await Project.find();
    if (!allProjects) throw Error("No Current Projects");
    return res.send({ status: "sucess", message: allProjects });
  } catch (e) {
    return res.status(503).send({ status: "failed", message: e.message });
  }
};

exports.createProjectView = (req, res) => {
  res.sendFile(
    path.join(
      path.dirname(process.mainModule.filename),
      "views",
      "createProject.html"
    )
  );
};
