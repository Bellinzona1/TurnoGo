const mongoose = require('mongoose');

// Subdocumento: reserva embebida dentro de un turno
const reservaSchema = new mongoose.Schema(
  {
    nombreCliente:   { type: String },
    telefonoCliente: { type: String },
    email:           { type: String },
    pago:            { type: String },
    fecha:           { type: String },
    estado:          { type: String },
    price:           { type: Number },
    idReserva:       { type: String }, // UUID para trazabilidad con MercadoPago
  },
  { _id: true }
);

const turnoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      nombre: { type: String, required: true },
      imagen: { type: String, required: true },
      valor:  { type: Number, required: true },
    },
    reservas: [reservaSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Turno', turnoSchema);
