# Google Drive Integration

## Environment Variables

Create a `.env` file in `backend/` with the following keys:

```
GOOGLE_PROJECT_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_ROOT_FOLDER_ID=
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
DRIVE_PREFETCH_IMAGE_COUNT=4
PORT=5001
```

`GOOGLE_DRIVE_ROOT_FOLDER_ID` can be left blank if you always pass a `folderId`/`parent` from the frontend.
`DRIVE_PREFETCH_IMAGE_COUNT` controls how many images are preloaded into memory (capped at ~5 MB each) on server start to speed up first-time requests.

## Google Cloud Setup (Service Account)

1. Create or open a Google Cloud project and record the project ID.
2. Enable the **Google Drive API** in *APIs & Services → Library*.
3. Navigate to *IAM & Admin → Service Accounts* and create a new service account with the `roles/drive.reader` (or similar read-only) permission.
4. Under that service account, create a new JSON key. Copy `client_email` and `private_key` into your `.env` file.
5. Share the Drive folder(s) you want to access with the service account email, giving Viewer access.
6. Note the folder ID from the Drive URL for use in the `.env` or frontend.

## Running the Backend

```bash
cd backend
npm install
npm run dev
```

## Running the Frontend

```bash
cd ..
yarn install
yarn dev
```

### Local Proxy Option

Add the following to `vite.config.ts` if you prefer proxying instead of setting `VITE_BACKEND_URL`:

```ts
server: {
  proxy: {
    "/drive": {
      target: "http://localhost:5001",
      changeOrigin: true,
    },
  },
},
```

Otherwise set `VITE_BACKEND_URL=http://localhost:5001` in `src`'s environment configuration.

## Using the React Component

Import `DriveBrowser` and render it with an optional root folder ID:

```tsx
import DriveBrowser from "@components/DriveBrowser";

function DrivePage() {
  return <DriveBrowser rootFolderId={import.meta.env.VITE_DEFAULT_DRIVE_FOLDER} />;
}
```

The component fetches folders/files from the backend and displays thumbnails by calling `/drive/image/:id`, converting the response into blob URLs.

