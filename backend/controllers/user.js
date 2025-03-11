const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generate } = require("../helpers/token");

//register
async function register(login, password, date_of_birth) {
  if (!password) {
    throw new Error("Password is entry");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const isUser = await User.findOne({ login }); // ищем пользователя по логину

  if (isUser) {
    throw new Error("Этот логин занят, попробуйте другой!");
  }

  const user = await User.create({
    login,
    password: passwordHash,
    date_of_birth: date_of_birth,
  });
  const token = generate({ id: user.id });

  return { user, token };
}

//login
async function login(login, password) {
  const user = await User.findOne({ login }); // ищем пользователя по логину

  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password); // сравнивает хэши введённого пароля и того, что в базе

  if (!isPasswordMatch) {
    throw new Error("Incorrect password");
  }

  const token = generate({ id: user.id });

  return { user, token };
}

//edit Login
async function updateUserLogin(id, login) {
  const user = await User.findOne(login); // ищем пользователя по логину
  if (user) {
    throw new Error("Такой логин уже занят");
  }
  return User.findByIdAndUpdate(id, login, { returnDocument: "after" });
}

//edit Password
async function updateUserPassword(id, newData) {
  const { login, oldPassword, newPassword } = newData;
  const isUser = await User.findOne({ login });

  const isPasswordMatch = await bcrypt.compare(oldPassword, isUser.password); // сравнивает хэши введённого пароля и того, что в базе
  if (!isPasswordMatch) {
    throw new Error("Старый пароль введён неверно");
  }

  const password = await bcrypt.hash(newPassword, 10);
  return User.findByIdAndUpdate(
    id,
    { password },
    {
      returnDocument: "after",
    }
  );
}

//edit DateOfBirth
function updateUserBirthDate(id, date_of_birth) {
  //передаём идентификатор юзера, новые данные
  //returnDocument: "after" говорит о том, чтобы мы сразу получали обновлённые данные
  return User.findByIdAndUpdate(id, date_of_birth, { returnDocument: "after" });
}

module.exports = {
  register,
  login,
  updateUserBirthDate,
  updateUserLogin,
  updateUserPassword,
};
