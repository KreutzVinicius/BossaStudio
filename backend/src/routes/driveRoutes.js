import { Router } from "express";
import {
  listFiles,
  listFolders,
  streamImage,
} from "../services/googleDriveClient.js";

const router = Router();
const { GOOGLE_DRIVE_ROOT_FOLDER_ID } = process.env;

router.get("/files", async (req, res, next) => {
  try {
    const folderId = req.query.folderId || GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!folderId) {
      const error = new Error("folderId query param is required.");
      error.status = 400;
      throw error;
    }

    const files = await listFiles(folderId);
    res.json({ files });
  } catch (error) {
    next(error);
  }
});

router.get("/folders", async (req, res, next) => {
  try {
    const parentId = req.query.parent || GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!parentId) {
      const error = new Error("parent query param is required.");
      error.status = 400;
      throw error;
    }

    const folders = await listFolders(parentId);
    res.json({ folders });
  } catch (error) {
    next(error);
  }
});

router.get("/image/:id", async (req, res, next) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      const error = new Error("file id param is required.");
      error.status = 400;
      throw error;
    }

    await streamImage(fileId, req, res);
  } catch (error) {
    next(error);
  }
});

export default router;

