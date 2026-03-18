const Emprendimiento = require('../models/emprendimiento.model');
const User = require('../models/user.model');

const createEmprendimiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, dominio, descripcion } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.emprendimiento) {
      return res.status(400).json({ message: 'El usuario ya tiene un emprendimiento asignado' });
    }

    const nuevoEmprendimiento = new Emprendimiento({ nombre, dominio, descripcion });
    await nuevoEmprendimiento.save();

    user.emprendimiento = nuevoEmprendimiento._id;
    await user.save();

    res.status(201).json({
      message: 'Emprendimiento creado y asignado con éxito',
      emprendimiento: nuevoEmprendimiento,
    });
  } catch (error) {
    next(error);
  }
};

const getEmprendimientos = async (req, res, next) => {
  try {
    const emprendimientos = await Emprendimiento.find();
    res.json(emprendimientos);
  } catch (error) {
    next(error);
  }
};

const getEmprendimientoByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'emprendimiento',
      populate: { path: 'contenido.turnos', model: 'Turno' },
    });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (!user.emprendimiento) {
      return res.status(404).json({ message: 'El usuario no tiene un emprendimiento asignado' });
    }

    res.json(user.emprendimiento);
  } catch (error) {
    next(error);
  }
};

const editEmprendimientoByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, dominio, subdominio, imagen, descripcion, plantilla, hora, direccion, apariencia, contenido } = req.body;

    const user = await User.findById(id).populate('emprendimiento');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (!user.emprendimiento) {
      return res.status(404).json({ message: 'El usuario no tiene un emprendimiento asignado' });
    }

    const actual = user.emprendimiento;

    const updateData = {
      nombre:      nombre      !== undefined ? nombre      : actual.nombre,
      dominio:     dominio     !== undefined ? dominio     : actual.dominio,
      subdominio:  subdominio  !== undefined ? subdominio  : actual.subdominio,
      imagen:      imagen      !== undefined ? imagen      : actual.imagen,
      descripcion: descripcion !== undefined ? descripcion : actual.descripcion,
      plantilla:   plantilla   !== undefined ? plantilla   : actual.plantilla,
      hora:        hora        !== undefined ? hora        : actual.hora,
      direccion:   direccion   !== undefined ? direccion   : actual.direccion,
    };

    if (apariencia) {
      updateData.apariencia = {
        colorPrincipal:   apariencia.colorPrincipal   ?? actual.apariencia?.colorPrincipal   ?? '#26D8DA',
        colorSecundario:  apariencia.colorSecundario  ?? actual.apariencia?.colorSecundario  ?? '#149861',
        usarImagenFondo:  apariencia.usarImagenFondo  ?? actual.apariencia?.usarImagenFondo  ?? true,
        imagenFondo:      apariencia.imagenFondo      ?? actual.apariencia?.imagenFondo      ?? '',
        colorFondo:       apariencia.colorFondo       ?? actual.apariencia?.colorFondo       ?? '#ffffff',
      };
    }

    if (contenido) {
      updateData.contenido = {
        turnos:        contenido.turnos        ?? actual.contenido?.turnos        ?? [],
        servicios:     contenido.servicios     ?? actual.contenido?.servicios     ?? [],
        redesSociales: contenido.redesSociales ?? actual.contenido?.redesSociales ?? [],
        galeria:       contenido.galeria       ?? actual.contenido?.galeria       ?? [],
        serviciosExtra: contenido.serviciosExtra ?? actual.contenido?.serviciosExtra ?? [],
      };
    }

    const emprendimientoActualizado = await Emprendimiento.findByIdAndUpdate(actual._id, updateData, { new: true });

    res.json({
      message: 'Emprendimiento actualizado con éxito',
      emprendimiento: emprendimientoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

const getEmprendimientoByName = async (req, res, next) => {
  try {
    const { name } = req.params;

    const emprendimiento = await Emprendimiento.findOne({
      dominio: { $regex: new RegExp(`^${name}$`, 'i') },
    }).populate({ path: 'contenido.turnos', model: 'Turno' });

    if (!emprendimiento) return res.status(404).json({ message: 'Emprendimiento no encontrado' });

    res.json(emprendimiento);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmprendimiento,
  getEmprendimientos,
  getEmprendimientoByUserId,
  editEmprendimientoByUserId,
  getEmprendimientoByName,
};
