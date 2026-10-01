import axios, { AxiosProgressEvent, AxiosResponse } from "axios";

// media-api `POST /upload` (SECURITY_FRONTEND_INTEGRATION.md §4). The host
// refuses anything outside this list — extension AND MIME must match — so
// every file picker mirrors it. SVG is deliberately excluded (it is XML and
// can carry <script>).
export const UPLOAD_ACCEPT = ".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm";
export const UPLOAD_ACCEPT_IMAGE = ".jpg,.jpeg,.png,.gif,.webp";

export interface UploadRes {
  filenames: string; // JSON-encoded string[] — see GF.parseFileName
}

// Once ops sets UPLOAD_KEY on media-api the header is required (401
// otherwise); until then it is ignored, so send it whenever configured and
// the switch can be flipped without a coordinated deploy.
const uploadHeaders = () => {
  const key = import.meta.env.VITE_UPLOAD_KEY;
  return key ? { "X-Upload-Key": key } : {};
};

export const uploadFileAPI = async (
  formData: FormData,
  onUploadProgress?: (event: AxiosProgressEvent) => void
) => {
  return await axios.post<undefined, AxiosResponse<UploadRes>>(
    import.meta.env.VITE_UPLOAD_URL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ...uploadHeaders(),
      },
      onUploadProgress,
    }
  );
};

// media-api refuses with `{ code: 1, message }` — 400 for type / size /
// file-count, 401 for a missing or wrong key. Surface that text rather than
// a generic "failed" so the admin knows what to change.
export const uploadErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
  }
  return "Upload failed.";
};
