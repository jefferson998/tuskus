import app from "./app";
import { PORT } from "./config";
import { connectDB } from "./db";

export async function main() {
  try {
    await connectDB().catch(console.dir);
    app.listen(PORT);
    console.log(`Listening on port http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`)
  } catch (error) {
    console.error(error);
  }
}

