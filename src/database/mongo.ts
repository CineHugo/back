import { MongoClient as Mongo, Db } from "mongodb";

export const MongoClient = {
  client: undefined as unknown as Mongo,
  db: undefined as unknown as Db,

  async connect(): Promise<void> {
    const url = process.env.MONGODB_URL || "localhost:27017";
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;

    const client = new Mongo(url, {
      auth: { username, password },
    });
    
    await client.connect();
    
    const db = client.db("users-db");
    
    this.client = client;
    this.db = db;

    await this.setupIndexes();

    console.log('Connected to MongoDB');
  },

    async setupIndexes(): Promise<void> {
    // Garante que a conexão com o banco de dados já foi estabelecida
    if (!this.db) {
      console.error("Database not connected. Cannot setup indexes.");
      return;
    }

    try {
      // Índice composto para evitar assento duplicado na mesma sessão
      await this.db.collection('tickets').createIndex(
        { "sessionId": 1, "seatLabel": 1 }, 
        { unique: true }
      );

      // Índice único para o QR Code do ticket
      await this.db.collection('tickets').createIndex(
        { "qrUuid": 1 }, 
        { unique: true }
      );
      
      console.log('Database indexes checked/created successfully.');
    } catch (error) {
      console.error("Error creating indexes:", error);
    }
  }
};
