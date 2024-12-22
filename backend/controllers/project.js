const Project = require("../models/Projects");

//add
async function addProject(project, id) {
  const newProject = await Project.create(project, id);
  return newProject;
}

//edit
async function editProject(id, project) {
  return Project.findByIdAndUpdate(id, project, {
    returnDocument: "after",
  }).populate({
    path: "tasks",
  });
}

//delete
async function deleteProject(id) {
  return Project.deleteOne({ _id: id });
}

//get list with search and pagination
async function getProjects(userId, search = "", limit = 10, page = 1) {
  const [projects, count] = await Promise.all([
    Project.find({ author: userId })
      .find({ title: { $regex: search, $options: "i" } })
      .limit(limit) //лимит количества проектов
      .skip((page - 1) * limit) //сколько нужно пропустить проектов
      .sort({ createdAt: -1 }) //сортировка по дате добавления
      .populate({ path: "tasks" }),
    Project.find({ author: userId }).countDocuments({
      title: { $regex: search, $options: "i" },
    }),
  ]);
  return {
    projects,
    lastPage: Math.ceil(count / limit),
  };
}

//get item
async function getProject(id) {
  return Project.findById(id).populate({
    path: "tasks",
  });
}

module.exports = {
  addProject,
  editProject,
  deleteProject,
  getProjects,
  getProject,
};
