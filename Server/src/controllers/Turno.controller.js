const Turno = require('../models/turno.model');
const Emprendimiento = require('../models/emprendimiento.model');

const createTurno = async (req, res, next) => {
  try {
    const { emprendimientoId } = req.params;
    const { titulo, nombre, imagen, valor } = req.body;

    if (!titulo || !nombre || !imagen) {
      return res.status(400).json({ message: 'titulo, nombre e imagen son obligatorios.' });
    }

    const nuevoTurno = new Turno({ titulo, descripcion: { nombre, imagen, valor } });
    await nuevoTurno.save();

    if (emprendimientoId) {
      const emprendimiento = await Emprendimiento.findById(emprendimientoId);
      if (!emprendimiento) return res.status(404).json({ message: 'Emprendimiento no encontrado.' });

      emprendimiento.contenido.turnos.push(nuevoTurno._id);
      await emprendimiento.save();
    }

    res.status(201).json({ message: 'Turno creado exitosamente.', turno: nuevoTurno });
  } catch (error) {
    next(error);
  }
};

const getTurnos = async (req, res, next) => {
  try {
    const turnos = await Turno.find();
    res.json(turnos);
  } catch (error) {
    next(error);
  }
};

const getTurnoById = async (req, res, next) => {
  try {
    const turno = await Turno.findById(req.params.id);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado.' });
    res.json(turno);
  } catch (error) {
    next(error);
  }
};

const getTurnosByEmprendimientoId = async (req, res, next) => {
  try {
    const emprendimiento = await Emprendimiento.findById(req.params.emprendimientoId).populate('contenido.turnos');
    if (!emprendimiento) return res.status(404).json({ message: 'Emprendimiento no encontrado.' });
    res.json(emprendimiento.contenido.turnos);
  } catch (error) {
    next(error);
  }
};

const editTurno = async (req, res, next) => {
  try {
    const { titulo, nombre, imagen, valor } = req.body;
    const actualizacion = { titulo };

    if (nombre || imagen || valor) {
      actualizacion.descripcion = {};
      if (nombre) actualizacion.descripcion.nombre = nombre;
      if (imagen) actualizacion.descripcion.imagen = imagen;
      if (valor)  actualizacion.descripcion.valor  = valor;
    }

    const turnoActualizado = await Turno.findByIdAndUpdate(req.params.id, { $set: actualizacion }, { new: true });
    if (!turnoActualizado) return res.status(404).json({ message: 'Turno no encontrado.' });

    res.json({ message: 'Turno actualizado con éxito.', turno: turnoActualizado });
  } catch (error) {
    next(error);
  }
};

const deleteTurno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const turnoEliminado = await Turno.findByIdAndDelete(id);
    if (!turnoEliminado) return res.status(404).json({ message: 'Turno no encontrado.' });

    await Emprendimiento.updateMany(
      { 'contenido.turnos': id },
      { $pull: { 'contenido.turnos': id } }
    );

    res.json({ message: 'Turno eliminado con éxito.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTurno, getTurnos, getTurnoById, getTurnosByEmprendimientoId, editTurno, deleteTurno };
