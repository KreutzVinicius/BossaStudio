import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchFiles,
  fetchFolders,
  fetchImageBlobUrl,
  type DriveFile,
  type DriveFolder,
} from "../services/driveApi";

function isImage(mimeType?: string | null) {
  return mimeType?.startsWith("image/");
}

export default function DriveBrowser({ rootFolderId }: { rootFolderId?: string }) {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(rootFolderId);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const thumbnailsRef = useRef(thumbnails);

  useEffect(() => {
    thumbnailsRef.current = thumbnails;
  }, [thumbnails]);

  const imageFiles = useMemo(
    () => files.filter((file) => isImage(file.mimeType)),
    [files],
  );

  useEffect(() => {
    if (!selectedFolder) return;

    setLoading(true);
    setError(null);

    Promise.all([fetchFolders(selectedFolder), fetchFiles(selectedFolder)])
      .then(([folderList, fileList]) => {
        setFolders(folderList as DriveFolder[]);
        setFiles(fileList as DriveFile[]);
      })
      .catch((err: Error) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [selectedFolder]);

  useEffect(() => {
    let isMounted = true;
    const urlsToRevoke: string[] = [];

    async function hydrateThumbnails() {
      const entries = await Promise.all(
        imageFiles.map(async (file) => {
          if (thumbnailsRef.current[file.id]) {
            return [file.id, thumbnailsRef.current[file.id]] as const;
          }
          try {
            const url = await fetchImageBlobUrl(file.id);
            urlsToRevoke.push(url);
            return [file.id, url] as const;
          } catch (err) {
            console.error(err);
            return [file.id, ""] as const;
          }
        }),
      );

      if (!isMounted) return;

      const updated = Object.fromEntries(entries);
      setThumbnails((prev) => ({ ...prev, ...updated }));
    }

    hydrateThumbnails();

    return () => {
      isMounted = false;
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  return (
    <div className="flex gap-6 w-full">
      <aside className="w-1/4 space-y-2 bg-muted/40 rounded-lg p-4">
        <h2 className="text-lg font-semibold">Folders</h2>
        <ul className="space-y-1">
          {folders.map((folder) => (
            <li key={folder.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded hover:bg-muted ${
                  selectedFolder === folder.id ? "bg-primary/10" : ""
                }`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex-1">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Images</h2>
          {selectedFolder && (
            <span className="text-sm text-muted-foreground">Folder: {selectedFolder}</span>
          )}
        </header>

        {loading && <p>Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageFiles.map((file) => {
            const thumbUrl = thumbnails[file.id];
            return (
              <article
                key={file.id}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                {thumbUrl ? (
                  <img src={thumbUrl} alt={file.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-muted animate-pulse" />
                )}
                <footer className="p-2 text-sm truncate">{file.name}</footer>
              </article>
            );
          })}
        </div>

        {!loading && imageFiles.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4">No images in this folder.</p>
        )}
      </section>
    </div>
  );
}

