const express = require('express');
const {
  getUsers,
  createUser,
  loginUser,
  loginWithGoogle,
  getUser,
  getProfile,
  updateUser,
} = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', getUsers);
router.post('/RegisterUser', createUser);
router.post('/LoginUser', loginUser);
router.post('/LoginGoogle', loginWithGoogle);

// El perfil del usuario autenticado (ruta específica antes de /:id)
router.get('/profile', authMiddleware, getProfile);

router.get('/:id', getUser);
router.put('/update/:id', authMiddleware, updateUser);

module.exports = router;
