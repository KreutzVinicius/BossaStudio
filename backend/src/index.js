import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import driveRoutes from "./routes/driveRoutes.js";
import { listFiles, prefetchImage } from "./services/googleDriveClient.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.js";
import { requestLogger, log } from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin ?? true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/drive", driveRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  log.info(`Drive backend listening on port ${PORT}`);
  warmInitialCache().catch((error) => {
    log.warn("Drive cache warmup failed:", error.message);
  });
});

async function warmInitialCache() {
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!rootFolderId) return;

  const prefetchCount = Number.parseInt(
    process.env.DRIVE_PREFETCH_IMAGE_COUNT ?? "4",
    10,
  );
  if (Number.isNaN(prefetchCount) || prefetchCount <= 0) return;

  try {
    const files = await listFiles(rootFolderId);
    const imageFiles = files
      .filter((file) => file.mimeType?.startsWith("image/"))
      .slice(0, prefetchCount);

    await Promise.all(imageFiles.map((file) => prefetchImage(file.id)));
    log.info(
      `Prefetched ${imageFiles.length} Drive image(s) for folder ${rootFolderId}`,
    );
  } catch (error) {
    log.warn("Error during Drive warmup:", error.message);
  }
}

