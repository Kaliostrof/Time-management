const JWT = require("jsonwebtoken");

const sign = process.env.JWT_SECRET;

function generate(data) {
  try {
    return JWT.sign(data, sign, { expiresIn: "30d" }); //expiresIn - срок жизни токена
  } catch (err) {
    console.log(err);
  }
}

function verify(token) {
  try {
    return JWT.verify(token, sign);
  } catch (err) {
    console.log(err);
  }
}

// //подписываем токен на data(данные юзера), используем секрет и указываем срок жизни
// generate(data) {
//   return JWT.sign(data, sign, { expiresIn: "30d" }); //expiresIn - срок жизни токена
// },

//   verify(token) {
//   //проверка токена
//   return JWT.verify(token, sign);
// },

module.exports = {
  generate,
  verify,
};
