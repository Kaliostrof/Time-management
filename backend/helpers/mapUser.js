module.exports = function (user) {
  return {
    id: user.id,
    login: user.login,
    dateOfBirth: user.date_of_birth,
    // registeredAt: user.createdAt,
  };
};
