const Emprendimiento = require('../models/emprendimiento.model');

const addService = async (req, res, next) => {
  try {
    const { emprendimientoId } = req.params;
    const { servicio } = req.body;

    if (!servicio || !Array.isArray(servicio)) {
      return res.status(400).json({ message: "'servicio' debe ser un array." });
    }

    const emprendimiento = await Emprendimiento.findById(emprendimientoId);
    if (!emprendimiento) return res.status(404).json({ message: 'Emprendimiento no encontrado.' });

    emprendimiento.contenido.servicios = servicio;
    await emprendimiento.save();

    res.status(200).json({ message: 'Servicios actualizados exitosamente.' });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const { emprendimientoId } = req.params;
    const { servicio } = req.body;

    if (!servicio) return res.status(400).json({ message: 'El nombre del servicio es obligatorio.' });

    const emprendimiento = await Emprendimiento.findById(emprendimientoId);
    if (!emprendimiento) return res.status(404).json({ message: 'Emprendimiento no encontrado.' });

    const index = emprendimiento.contenido.servicios.indexOf(servicio);
    if (index === -1) return res.status(404).json({ message: 'Servicio no encontrado.' });

    emprendimiento.contenido.servicios.splice(index, 1);
    await emprendimiento.save();

    res.status(200).json({ message: 'Servicio eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addService, deleteService };
