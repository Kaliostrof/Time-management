const JWT = require("jsonwebtoken");

const sign = process.env.JWT_SECRET;

module.exports = {
  //подписываем токен на data(данные юзера), используем секрет и указываем срок жизни
  generate(data) {
    return JWT.sign(data, sign, { expiresIn: "30d" }); //expiresIn - срок жизни токена
  },
  verify(token) {
    //проверка токена
    return JWT.verify(token, sign);
  },
};
