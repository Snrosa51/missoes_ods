// backend/tests/api.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const { sequelize } = require('../models');

// Criamos uma instância de app minimal para testes
const app = express();
app.use(bodyParser());
const apiRoutes = require('../routes/api');
const authRoutes = require('../routes/auth');

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

let server;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // recria DB para testes
  server = app.listen(0); // porta random
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

test('registro e login de usuário', async () => {
  const user = { name: 'Test', email: 'test@example.com', password: '123456' };
  const reg = await request(app).post('/auth/register').send(user);
  expect(reg.statusCode).toBe(200);
  const login = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
  expect(login.statusCode).toBe(200);
  expect(login.body.token).toBeDefined();
});
