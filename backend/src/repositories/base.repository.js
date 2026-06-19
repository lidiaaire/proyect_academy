'use strict';

/**
 * Capa de acceso a datos genérica. Todos los repositories del dominio la extienden.
 * Es la única abstracción sobre Mongoose: los Services nunca importan modelos directamente.
 *
 * runValidators: true en updateById — garantiza que los validators del schema
 * se ejecutan también en operaciones de actualización, no solo en create/save.
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  // Devuelve null si no existe. El Service decide si ese null es un error.
  async findById(id, projection = null) {
    return this.model.findById(id, projection);
  }

  // Primer documento que coincide con el filtro, o null.
  async findOne(filter, projection = null) {
    return this.model.findOne(filter, projection);
  }

  // Listado paginado. El caller construye `filter` de forma segura antes de llamar aquí.
  // Promise.all ejecuta find + countDocuments en paralelo para minimizar latencia.
  async findAll(filter = {}, options = {}) {
    const skip  = options.skip  ?? 0;
    const limit = options.limit ?? 20;
    const sort  = options.sort  ?? { createdAt: -1 };

    const [docs, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit).sort(sort),
      this.model.countDocuments(filter),
    ]);

    return { docs, total };
  }

  // Lanza ValidationError de Mongoose si los datos no pasan el schema.
  async create(data) {
    return this.model.create(data);
  }

  // $set garantiza actualización parcial (no reemplaza el documento).
  // runValidators: true + context: 'query' para que los validators del schema se ejecuten en updates.
  async updateById(id, update, options = {}) {
    return this.model.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true, context: 'query', ...options },
    );
  }

  // Eliminación física. UserRepository no la usa (soft delete), pero otros módulos sí.
  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  // Model.exists() devuelve { _id } | null en Mongoose 8 — más eficiente que countDocuments.
  async exists(filter) {
    return (await this.model.exists(filter)) !== null;
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

module.exports = BaseRepository;
