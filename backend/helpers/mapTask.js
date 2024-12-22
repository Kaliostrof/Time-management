module.exports = function (task) {
  return {
    id: task._id,
    description: task.description,
    time: task.time,
    totalSec: task.total_sec,
    createdAt: task.createdAt,
  };
};
