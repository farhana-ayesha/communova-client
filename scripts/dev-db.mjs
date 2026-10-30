import { mkdirSync } from "node:fs";
import path from "node:path";
import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Local development database.
 *
 * Starts a real mongod on 127.0.0.1:27017 with data persisted under `.data/mongo`,
 * so Better Auth can be exercised end-to-end without an Atlas cluster.
 * The first run downloads a mongod binary (~80 MB). Stop with Ctrl+C.
 */
const port = Number(process.env.DEV_DB_PORT ?? 27017);
const dataDir = path.resolve(process.cwd(), ".data", "mongo");

mkdirSync(dataDir, { recursive: true });

const mongo = await MongoMemoryServer.create({
  instance: {
    port,
    dbName: "communova",
    dbPath: dataDir,
    storageEngine: "wiredTiger",
  },
});

const uri = `mongodb://127.0.0.1:${port}/communova`;
console.log(`[dev-db] ready at ${uri}`);
console.log(`[dev-db] data stored in ${dataDir}`);
console.log("[dev-db] press Ctrl+C to stop");

let stopping = false;

async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.log(`[dev-db] ${signal} received · stopping`);
  await mongo.stop({ doCleanup: false });
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
