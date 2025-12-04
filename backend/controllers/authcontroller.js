// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Campos faltando' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email já cadastrado' });

    const user = await User.create({ name, email, passwordHash: password });
    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro interno' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });

    const valid = await user.checkPassword(password);
    if (!valid) return res.status(400).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro interno' });
  }
};

module.exports = { register, login };
