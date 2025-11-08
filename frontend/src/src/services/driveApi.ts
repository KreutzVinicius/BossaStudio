const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5001";

export type DriveFolder = {
  id: string;
  name: string;
  mimeType: string;
};

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

async function handleJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = (payload as { error?: string }).error ?? "Request failed";
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function fetchFolders(parentId?: string): Promise<DriveFolder[]> {
  const url = new URL("/drive/folders", BASE_URL);
  if (parentId) url.searchParams.set("parent", parentId);

  const response = await fetch(url.toString(), { credentials: "include" });
  const data = await handleJson<{ folders: DriveFolder[] }>(response);
  return data.folders;
}

export async function fetchFiles(folderId?: string): Promise<DriveFile[]> {
  const url = new URL("/drive/files", BASE_URL);
  if (folderId) url.searchParams.set("folderId", folderId);

  const response = await fetch(url.toString(), { credentials: "include" });
  const data = await handleJson<{ files: DriveFile[] }>(response);
  return data.files;
}

export async function fetchImageBlobUrl(fileId: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/drive/image/${fileId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image (${response.status})`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

