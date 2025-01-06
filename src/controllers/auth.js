import * as authServices from '../services/auth.js';

export const registerController = async (req, res) => {
  const { username, email, _id, createdAt, updatedAt } =
    await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      username,
      email,
      _id,
      createdAt,
      updatedAt,
    },
  });
};
