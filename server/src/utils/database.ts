import mongoose from "mongoose";

import { DATABASE_CONFIG } from "./constants.js";

let pendingConnection: Promise<typeof mongoose> | null = null;

const connectDatabase = async (
  mongoUri: string,
): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!pendingConnection) {
    pendingConnection = mongoose
      .connect(mongoUri, {
        maxPoolSize: DATABASE_CONFIG.MAX_POOL_SIZE,
        family: 4,
        connectTimeoutMS: DATABASE_CONFIG.CONNECT_TIMEOUT_MS,
        serverSelectionTimeoutMS:
          DATABASE_CONFIG.SERVER_SELECTION_TIMEOUT_MS,
      })
      .then((connection) => {
        process.stdout.write("Conectado a MongoDB\n");
        return connection;
      });
  }

  try {
    return await pendingConnection;
  } finally {
    pendingConnection = null;
  }
};

export { connectDatabase };
