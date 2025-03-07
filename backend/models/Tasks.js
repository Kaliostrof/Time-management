const mongoose = require("mongoose");

const TasksSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    time: {
      type: Object,
      required: true,
    },
    total_sec: {
      type: Number,
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

const Tasks = mongoose.model("Tasks", TasksSchema);

module.exports = Tasks;
