const express = require("express");
const {
  deleteProject,
  editProject,
  addProject,
  getProject,
  getProjects,
} = require("../controllers/project");
const { deleteTask, addTask } = require("../controllers/tasks");
const mapProject = require("../helpers/mapProject");
const mapTask = require("../helpers/mapTask");
const authenticated = require("../middlewares/authenticated");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, async (req, res) => {
  try {
    const { projects, lastPage } = await getProjects(
      req.user.id,
      req.query.search,
      req.query.limit,
      req.query.page
    );
    res.send({
      data: { lastPage, projects: projects.map(mapProject) },
      error: null,
    });
  } catch (err) {
    res.send({ error: err.message } || "Unknown error");
  }
});

router.get("/:id", authenticated, async (req, res) => {
  try {
    const project = await getProject(req.params.id);
    res.send({ data: mapProject(project), error: null });
  } catch (err) {
    res.send({ error: err.message } || "Unknown error");
  }
});

router.post("/", authenticated, async (req, res) => {
  try {
    const newProject = await addProject({
      title: req.body.title,
      author: req.user.id,
    });

    res.send({ data: newProject });
  } catch (err) {
    res.send({ error: err.message });
  }
});

router.patch("/:id", authenticated, async (req, res) => {
  try {
    const updatedProject = await editProject(req.params.id, {
      title: req.body.title,
    });
    res.send({ data: mapProject(updatedProject) });
  } catch (err) {
    res.send({ error: err.message });
  }
});

router.delete("/:id", authenticated, async (req, res) => {
  try {
    await deleteProject(req.params.id);
    const { projects, lastPage } = await getProjects(
      req.user.id,
      req.query.search,
      req.query.limit,
      req.query.page
    );

    res.send({
      data: { lastPage, projects: projects.map(mapProject) },
      error: null,
    });
  } catch (err) {
    res.send({ error: err.message });
  }
});

router.post("/:id/tasks", authenticated, async (req, res) => {
  try {
    const newTask = await addTask(req.params.id, {
      description: req.body.task,
      time: req.body.time,
      total_sec: req.body.totalSec,
      project_id: req.body.projectId,
    });

    res.send({ data: mapTask(newTask) });
  } catch (err) {
    res.send({ error: err.message });
  }
});

router.delete("/:projectId/tasks/:taskId", authenticated, async (req, res) => {
  await deleteTask(req.params.projectId, req.params.taskId);

  res.send({ error: null });
});

module.exports = router;
