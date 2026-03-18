const User = require('../models/user.model');
const Emprendimiento = require('../models/emprendimiento.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');

const createDefaultEmprendimiento = async (userName, userEmail) => {
  const emailPrefix = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  const timestamp = Date.now().toString().slice(-4);

  const defaultEmprendimiento = new Emprendimiento({
    nombre: `${userName}'s Business`,
    dominio: `${emailPrefix}${timestamp}`,
    descripcion: 'Bienvenido a tu nuevo emprendimiento. Personaliza esta descripción desde tu panel de administración.',
    imagen: 'https://donpotrero.com/img/posts/2/medidas_sm.jpg',
    plantilla: '1',
    contenido: {
      turnos: [],
      servicios: ['Servicio de ejemplo'],
      redesSociales: [],
    },
    hora: '1',
  });

  await defaultEmprendimiento.save();
  return defaultEmprendimiento._id;
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, '-password').populate('emprendimiento');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId, '-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, imageProfile, accountStatus } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const emprendimientoId = await createDefaultEmprendimiento(name, email);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      imageProfile,
      accountStatus,
      emprendimiento: emprendimientoId,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuario y emprendimiento creados con éxito',
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Inicio de sesión exitoso',
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const loginWithGoogle = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      const emprendimientoId = await createDefaultEmprendimiento(name, email);
      user = await User.create({
        email,
        name,
        password: 'google',
        isGoogle: true,
        emprendimiento: emprendimientoId,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Inicio de sesión con Google exitoso',
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, imageProfile, accountStatus } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (imageProfile !== undefined) user.imageProfile = imageProfile;
    if (accountStatus !== undefined) user.accountStatus = accountStatus;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: 'Usuario actualizado con éxito',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        imageProfile: user.imageProfile,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, getProfile, createUser, loginUser, loginWithGoogle, updateUser };
