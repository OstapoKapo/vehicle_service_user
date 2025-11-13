// user-service/controllers/userController.js

// (Поки що просто зімітуємо модель)
// const User = require('../models/userModel');

// Функція для GET /users
export const getAllUsers = (req: any, res: any) => {
  // Тут була б логіка:
  // const users = await User.findAll();
  // res.json(users);

  res.send('Отримано всіх користувачів (з контролера)');
};

// Функція для POST /users  
export const createNewUser = (req: any, res: any) => {
  const { email, password } = req.body;

  // Тут була б логіка:
  // const newUser = await User.create({ email, password });
  // res.status(201).json(newUser);

  res.status(201).send(`Створено користувача з email: ${email}`);
};

export default {
    getAllUsers,
    createNewUser
}