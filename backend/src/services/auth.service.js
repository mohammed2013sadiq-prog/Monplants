const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, full_name: user.full_name },
    process.env.JWT_SECRET || 'moplants_default_secret',
    { expiresIn: '7d' }
  );
};

const register = async ({ full_name, email, password, avatar }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    full_name,
    email,
    password: hashedPassword,
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  });

  const token = generateToken(newUser);

  return {
    user: {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      avatar: newUser.avatar,
      created_at: newUser.created_at
    },
    token
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at
    },
    token
  };
};
const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'full_name', 'email', 'avatar', 'created_at']
  });
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, { full_name, avatar }) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  if (full_name !== undefined) user.full_name = full_name;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    avatar: user.avatar,
    created_at: user.created_at
  };
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
