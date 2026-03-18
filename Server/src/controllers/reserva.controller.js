const Turno = require('../models/turno.model');

const getTurnoConReservas = async (req, res, next) => {
  try {
    const turno = await Turno.findById(req.params.id);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });
    res.status(200).json(turno);
  } catch (error) {
    next(error);
  }
};

const agregarReserva = async (req, res, next) => {
  try {
    const { nombreCliente, telefonoCliente, pago, fecha, estado, price } = req.body;

    const turno = await Turno.findById(req.params.id);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });

    turno.reservas.push({ nombreCliente, telefonoCliente, pago, fecha, estado, price });
    await turno.save();

    res.status(201).json({ message: 'Reserva agregada', turno });
  } catch (error) {
    next(error);
  }
};

const eliminarReserva = async (req, res, next) => {
  try {
    const { id, reservaId } = req.params;

    const turno = await Turno.findById(id);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });

    const reservaIndex = turno.reservas.findIndex((r) => r._id?.toString() === reservaId);

    if (reservaIndex === -1) {
      // Fallback: buscar por índice numérico
      const indexNum = parseInt(reservaId);
      if (!isNaN(indexNum) && indexNum >= 0 && indexNum < turno.reservas.length) {
        turno.reservas.splice(indexNum, 1);
        await turno.save();
        return res.status(200).json({ message: 'Reserva eliminada correctamente', turno });
      }
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    turno.reservas.splice(reservaIndex, 1);
    await turno.save();

    res.status(200).json({ message: 'Reserva eliminada correctamente', turno });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTurnoConReservas, agregarReserva, eliminarReserva };
