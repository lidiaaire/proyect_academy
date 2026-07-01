'use strict';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose              = require('mongoose');

let mongod;

// Inicia MongoMemoryServer y conecta Mongoose.
// Llama en beforeAll de cada suite de integración.
const connectDatabase = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

// Vacía todas las colecciones sin destruir la conexión ni detener el servidor.
// Útil para limpiar entre tests dentro de una misma suite.
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((col) => col.deleteMany({}))
  );
};

// Destruye la base de datos, cierra la conexión y detiene MongoMemoryServer.
// Llama en afterAll de cada suite de integración.
const disconnectDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports = { connectDatabase, clearDatabase, disconnectDatabase };
