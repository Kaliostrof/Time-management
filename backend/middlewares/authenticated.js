const { verify } = require("../helpers/token");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    res.send({ error: "Вы не авторизованы!" }); //передаём ошибку сразу на фронт

    return;
  }
  const tokenData = verify(req.cookies.token);
  const user = await User.findOne({ _id: tokenData.id });

  if (!user) {
    res.send({ error: "Authenticated user not found" }); //передаём ошибку сразу на фронт

    return;
  }

  req.user = user;

  next();
};
