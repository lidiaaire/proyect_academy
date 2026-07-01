'use strict';

const BaseRepository = require('./base.repository');
const User           = require('../models/user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  // --- Métodos de Auth ---

  // Devuelve el usuario CON passwordHash. Uso exclusivo: AuthService.login.
  // El prefijo '+' es obligatorio para seleccionar un campo con select:false en el schema.
  async findByEmailWithPassword(email) {
    return this.model.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  }

  // Devuelve el usuario CON passwordHash. Uso exclusivo: AuthService.changePassword.
  async findByIdWithPassword(id) {
    return this.model.findById(id).select('+passwordHash');
  }

  // Actualiza lastLoginAt sin recuperar el documento — .updateOne evita el overhead
  // de hidratar el documento cuando no lo necesitamos.
  // El Service puede llamarlo sin await para no añadir latencia al response de login.
  async updateLastLogin(id) {
    await this.model.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } });
  }

  // Actualiza exclusivamente passwordHash. Operación aislada de updateProfile
  // para que la contraseña nunca pase por una ruta de actualización genérica.
  // El hash llega ya procesado desde AuthService — el Repository no hashea.
  async updatePassword(id, passwordHash) {
    await this.model.updateOne({ _id: id }, { $set: { passwordHash } });
  }

  // --- Métodos de Users ---

  // Comprobación de unicidad de email sin hidratar el documento.
  // excludeId: excluye ese _id de la búsqueda — necesario al actualizar el email
  // de un usuario existente para no comparar el email contra sí mismo.
  async existsByEmail(email, excludeId = null) {
    const filter = { email: email.toLowerCase() };
    if (excludeId) filter._id = { $ne: excludeId };
    return (await this.model.exists(filter)) !== null;
  }

  // Override del método base para construir la query explícitamente campo a campo.
  // NO hace spread de filters: previene inyección de operadores MongoDB ($ne, $gt, etc.)
  // si el Service propagara datos sin sanitizar del request.
  async findAll(filters = {}, options = {}) {
    const query = {};
    if (filters.role              !== undefined) query.role              = filters.role;
    if (filters.isActive          !== undefined) query.isActive          = filters.isActive;
    if (filters.assignedTeacherId !== undefined) query.assignedTeacherId = filters.assignedTeacherId;

    return super.findAll(query, options);
  }

  async incrementPoints(id, points) {
    return this.model.findByIdAndUpdate(
      id,
      { $inc: { achievementPoints: points } },
      { new: true, select: 'achievementPoints' },
    );
  }

  // Actualiza campos de perfil seguros. Whitelist por destructuring: passwordHash,
  // role y _id no pueden actualizarse por esta vía aunque se pasen en data.
  // BaseRepository.updateById aplica $set + runValidators, garantizando B1 (avatarUrl regex).
  async updateProfile(id, data) {
    const { firstName, lastName, email, avatarUrl, isActive, assignedTeacherId } = data;

    const update = {};
    if (firstName         !== undefined) update.firstName         = firstName;
    if (lastName          !== undefined) update.lastName          = lastName;
    if (email             !== undefined) update.email             = email;
    if (avatarUrl         !== undefined) update.avatarUrl         = avatarUrl;
    if (isActive          !== undefined) update.isActive          = isActive;
    if (assignedTeacherId !== undefined) update.assignedTeacherId = assignedTeacherId;

    return this.updateById(id, update);
  }
}

// Singleton: el estado reside en Mongoose (stateless a nivel de instancia).
module.exports = new UserRepository();
