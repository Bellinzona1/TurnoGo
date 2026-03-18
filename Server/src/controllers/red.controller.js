const Emprendimiento = require('../models/emprendimiento.model');

const addRed = async (req, res, next) => {
  try {
    const { emprendimientoId } = req.params;
    const { red } = req.body;

    if (!red?.nombre || !red?.url) {
      return res.status(400).json({ message: 'nombre y url son obligatorios.' });
    }

    const emprendimiento = await Emprendimiento.findById(emprendimientoId);
    if (!emprendimiento) return res.status(404).json({ message: 'Emprendimiento no encontrado.' });

    if (!Array.isArray(emprendimiento.contenido.redesSociales)) {
      emprendimiento.contenido.redesSociales = [];
    }

    emprendimiento.contenido.redesSociales.push({ nombre: red.nombre, url: red.url });
    await emprendimiento.save();

    res.status(201).json({ message: 'Red social añadida exitosamente.' });
  } catch (error) {
    next(error);
  }
};

const clearRedes = async (req, res, next) => {
  try {
    const emprendimiento = await Emprendimiento.findById(req.params.emprendimientoId);
    if (!emprendimiento) return res.status(404).json({ message: 'Emprendimiento no encontrado.' });

    emprendimiento.contenido.redesSociales = [];
    await emprendimiento.save();

    res.status(200).json({ message: 'Redes sociales limpiadas exitosamente.', redesSociales: [] });
  } catch (error) {
    next(error);
  }
};

module.exports = { addRed, clearRedes };
