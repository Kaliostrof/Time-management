const { default: mongoose } = require("mongoose");
const mapTask = require("./mapTask");

module.exports = function (project) {
  return {
    id: project._id,
    title: project.title,
    createdAt: project.createdAt,
    tasks: project.tasks.map((task) => {
      return mongoose.isObjectIdOrHexString(task) ? task : mapTask(task);
    }),
  };
};
