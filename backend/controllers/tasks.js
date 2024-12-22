const Project = require("../models/Projects");
const Tasks = require("../models/Tasks");

//add
async function addTask(projectId, task) {
  const newTask = await Tasks.create(task);

  await Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask } });
  //в массив tasks(в модели Project) добавляем newTask
  return newTask;
}

//delete
async function deleteTask(projectId, taskId) {
  await Tasks.deleteOne({ _id: taskId });

  await Project.findByIdAndUpdate(projectId, { $pull: { tasks: taskId } });
}

//get list for project
async function getTasks() {}

module.exports = {
  addTask,
  deleteTask,
};
