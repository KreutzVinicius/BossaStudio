import { createHash } from "node:crypto";
import { google } from "googleapis";
import {LRUCache} from "lru-cache";
import dotenv from "dotenv";

dotenv.config();

const {
  GOOGLE_PROJECT_ID,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
} = process.env;

if (!GOOGLE_PROJECT_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
  throw new Error("Missing required Google Drive credentials in .env");
}

const auth = new google.auth.JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

auth.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    console.log("[INFO] Received new refresh token");
  }
});

auth.on("error", (err) => {
  console.error("[ERROR] Google Auth failure:", err.message);
});

const drive = google.drive({
  version: "v3",
  project: GOOGLE_PROJECT_ID,
  auth,
});

const metadataCache = new LRUCache({
  max: 200,
  ttl: 1000 * 60 * 5, // 5 minutes
});

const imageCache = new LRUCache({
  max: 50,
  ttl: 1000 * 60 * 10, // 10 minutes
});

const MAX_IMAGE_CACHE_BYTES = 5 * 1024 * 1024; // 5MB

const imageCacheKey = (fileId) => `image:${fileId}`;

function mapFile(file) {
  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size ? Number(file.size) : null,
    thumbnailLink: file.thumbnailLink ?? null,
    createdTime: file.createdTime,
    modifiedTime: file.modifiedTime,
  };
}

export async function listFiles(folderId) {
  const cacheKey = `files:${folderId}`;
  const cached = metadataCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const queryParts = [
    `'${folderId}' in parents`,
    "trashed = false",
    "mimeType != 'application/vnd.google-apps.folder'",
  ];

  try {
    const response = await drive.files.list({
      q: queryParts.join(" and "),
      fields:
        "files(id, name, mimeType, size, thumbnailLink, createdTime, modifiedTime)",
      orderBy: "folder, name",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    const files = response.data.files.map(mapFile);
    metadataCache.set(cacheKey, files);
    return files;
  } catch (error) {
    throw handleDriveError(error);
  }
}

export async function listFolders(parentId) {
  const cacheKey = `folders:${parentId}`;
  const cached = metadataCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const queryParts = [
    `'${parentId}' in parents`,
    "trashed = false",
    "mimeType = 'application/vnd.google-apps.folder'",
  ];

  try {
    const response = await drive.files.list({
      q: queryParts.join(" and "),
      fields: "files(id, name, mimeType, createdTime, modifiedTime)",
      orderBy: "name",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    const folders = response.data.files.map(mapFile);
    metadataCache.set(cacheKey, folders);
    return folders;
  } catch (error) {
    throw handleDriveError(error);
  }
}

export async function prefetchImage(fileId) {
  try {
    await downloadAndCacheImage(fileId);
  } catch (error) {
    const err = handleDriveError(error);
    console.warn("[WARN] Failed to prefetch image:", err.message);
  }
}

export async function streamImage(fileId, req, res) {
  const cached = imageCache.get(imageCacheKey(fileId));

  if (cached) {
    if (req.headers["if-none-match"] === cached.etag) {
      res.status(304).end();
      return;
    }

    res.setHeader("Content-Type", cached.contentType);
    res.setHeader("Cache-Control", "public, max-age=600, stale-while-revalidate=60");
    res.setHeader("ETag", cached.etag);
    res.end(cached.buffer);
    return;
  }

  try {
    const driveResponse = await drive.files.get(
      {
        fileId,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "stream",
      }
    );

    const contentType =
      driveResponse.headers["content-type"] ?? "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=600, stale-while-revalidate=60");

    const chunks = [];
    let totalBytes = 0;
    let canCache = true;

    await new Promise((resolve, reject) => {
      driveResponse.data
        .on("data", (chunk) => {
          totalBytes += chunk.length;

          if (canCache) {
            chunks.push(chunk);
            if (totalBytes > MAX_IMAGE_CACHE_BYTES) {
              canCache = false;
              chunks.length = 0;
            }
          }

          const shouldContinue = res.write(chunk);
          if (!shouldContinue) {
            driveResponse.data.pause();
            res.once("drain", () => driveResponse.data.resume());
          }
        })
        .on("end", () => {
          let etag = null;
          if (canCache) {
            const buffer = Buffer.concat(chunks);
            etag = createEtag(buffer);
            imageCache.set(imageCacheKey(fileId), {
              buffer,
              contentType,
              etag,
            });
          }

          if (etag && !res.headersSent) {
            res.setHeader("ETag", etag);
          }

          res.end();
          resolve();
        })
        .on("error", (streamError) => {
          const err = handleDriveError(streamError);
          console.error("[ERROR] Stream failure:", err.message);
          res.destroy(err);
          reject(err);
        });
    });
  } catch (error) {
    throw handleDriveError(error);
  }
}

async function downloadAndCacheImage(fileId) {
  const cacheKey = imageCacheKey(fileId);
  const existing = imageCache.get(cacheKey);
  if (existing) {
    return existing;
  }

  const driveResponse = await drive.files.get(
    {
      fileId,
      alt: "media",
      supportsAllDrives: true,
    },
    {
      responseType: "stream",
    }
  );

  const contentType =
    driveResponse.headers["content-type"] ?? "application/octet-stream";

  const chunks = [];
  let totalBytes = 0;
  let canCache = true;

  await new Promise((resolve, reject) => {
    driveResponse.data
      .on("data", (chunk) => {
        totalBytes += chunk.length;
        if (canCache) {
          chunks.push(chunk);
          if (totalBytes > MAX_IMAGE_CACHE_BYTES) {
            canCache = false;
            chunks.length = 0;
          }
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });

  if (!canCache) {
    return null;
  }

  const buffer = Buffer.concat(chunks);
  const etag = createEtag(buffer);
  const payload = { buffer, contentType, etag };
  imageCache.set(cacheKey, payload);
  return payload;
}

function createEtag(buffer) {
  const hash = createHash("sha1").update(buffer).digest("hex");
  return `W/"${buffer.length.toString(16)}-${hash}"`;
}

function handleDriveError(error) {
  if (error?.status && error.message) {
    return error;
  }

  if (error?.code === 401 || error?.code === 403) {
    return createDriveError("Google Drive authentication failed", 502, error);
  }

  if (error?.code === 429) {
    return createDriveError("Drive API rate limit exceeded", 429, error);
  }

  return createDriveError("Failed to communicate with Google Drive", 502, error);
}

function createDriveError(message, status, cause) {
  const err = new Error(message);
  err.status = status;
  err.cause = cause;
  if (cause?.errors) {
    err.errors = cause.errors;
  }
  return err;
}
