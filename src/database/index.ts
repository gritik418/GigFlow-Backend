import mongoose from "mongoose";

const mongoURI: string = process.env.MONGO_URI!;

const connectToDB = async () => {
  try {
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined");
    }

    const { connection } = await mongoose.connect(mongoURI, {
      dbName: "gigflow",
    });

    if (!connection.readyState) throw new Error("MongoDB connection failed");

    console.log(`Mongo connected: ${connection.name}`);
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

export default connectToDB;
