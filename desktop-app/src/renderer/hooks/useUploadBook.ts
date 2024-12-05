/* eslint-disable promise/catch-or-return */
/* eslint-disable compat/compat */
import { useState, useCallback } from 'react';

interface IUploadBookResponse {
  uploadBook: (filePaths: string[]) => void;
  uploading: boolean;
  uploadError: string | null;
  uploadSuccess: boolean;
  resetUploadSuccess: () => void;
}

function useUploadBook(): IUploadBookResponse {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const uploadBook = useCallback((filePaths: string[]) => {
    if (filePaths.length === 0) {
      setUploadError('No file paths provided.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const promises = filePaths.map((filePath) => {
      return window.electron.ipcRenderer
        .invoke('add-book', filePath)
        .then(() => ({ success: true, filePath }))
        .catch((err: Error) => ({
          success: false,
          filePath,
          error: err.message,
        }));
    });

    Promise.all(promises)
      .then((results) => {
        const failedUploads = results.filter((result) => !result.success);
        // eslint-disable-next-line promise/always-return
        if (failedUploads.length > 0) {
          setUploadError(
            `Failed to upload: ${failedUploads
              .map((result) => result.filePath)
              .join(', ')}`,
          );
        } else {
          setUploadSuccess(true);
        }
      })
      .catch((err: Error) => {
        setUploadError(`Error uploading books: ${err.message}`);
      })
      .finally(() => setUploading(false));
  }, []);

  const resetUploadSuccess = () => setUploadSuccess(false);

  return {
    uploadBook,
    uploading,
    uploadError,
    uploadSuccess,
    resetUploadSuccess,
  };
}

export default useUploadBook;
