import mongoose from "mongoose";

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
        maxPoolSize: 10,
        family: 4,
        connectTimeoutMS: 8000,
        serverSelectionTimeoutMS: 8000,
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
