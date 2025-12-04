// backend/models/user.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

class User extends Model {
  async checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'student' } // student | admin
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users'
});

// Hook para criar hash antes de salvar
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
});

module.exports = User;
