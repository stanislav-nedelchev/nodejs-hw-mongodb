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

export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
