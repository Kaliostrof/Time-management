const express = require("express");
const {
  updateUserBirthDate,
  updateUserLogin,
  updateUserPassword,
} = require("../controllers/user");
const mapUser = require("../helpers/mapUser");
const authenticated = require("../middlewares/authenticated");

const router = express.Router({ mergeParams: true });

router.patch("/:id/date", authenticated, async (req, res) => {
  const newUser = await updateUserBirthDate(req.params.id, {
    date_of_birth: req.body.dateOfBirth,
  });

  res.send({ data: mapUser(newUser) });
});

router.patch("/:id/login", authenticated, async (req, res) => {
  try {
    const newUser = await updateUserLogin(req.params.id, {
      login: req.body.login,
    });

    res.send({ data: mapUser(newUser) });
  } catch (err) {
    res.send({ error: err.message } || "Unknown error");
  }
});

router.patch("/:id/password", authenticated, async (req, res) => {
  try {
    await updateUserPassword(req.params.id, {
      login: req.body.login,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });
    res.send({ error: null });
  } catch (err) {
    res.send({ error: err.message } || "Unknown error");
  }
});

module.exports = router;
