// backend/controllers/userController.js
const { User } = require('../models');

const getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id','name','email','role','createdAt'] });
  res.json(user);
};

module.exports = { getProfile };
