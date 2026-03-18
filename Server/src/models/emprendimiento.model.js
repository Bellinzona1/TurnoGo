const mongoose = require("mongoose");

const EmprendimientoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    dominio: {
      type: String,
      required: true,
      unique: true, // Cada dominio debe ser único
    },
    descripcion: {
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      default: "https://donpotrero.com/img/posts/2/medidas_sm.jpg",
    },
    plantilla: {
      type: String,
      default: "1",
    },
    contenido: {
      turnos: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Turno",
        },
      ],
      servicios: [
        {
          type: String,
        },
      ],
      redesSociales: [
        {
          nombre: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
      galeria: [
        {
          type: String, // URLs de las imágenes de la galería
        },
      ],
      serviciosExtra: [
        {
          nombre: {
            type: String,
            required: true,
          },
          descripcion: {
            type: String,
          },
          icono: {
            type: String,
          },
        },
      ],
    },
    apariencia: {
      colorPrincipal: {
        type: String,
        default: "#26D8DA",
      },
      colorSecundario: {
        type: String,
        default: "#149861",
      },
      usarImagenFondo: {
        type: Boolean,
        default: true,
      },
      imagenFondo: {
        type: String,
        default: "",
      },
      colorFondo: {
        type: String,
        default: "#ffffff",
      },
    },
    hora: {
      type: String,
      default: "1",
    },
  },
  { timestamps: true }
);

const Emprendimiento = mongoose.model("Emprendimiento", EmprendimientoSchema);

module.exports = Emprendimiento;
