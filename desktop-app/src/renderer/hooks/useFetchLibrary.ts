import { useEffect, useState, useCallback } from 'react';
import { IUserLibrary } from '../../shared/interfaces/interfaces';

interface IUseLibraryResponse {
  library: IUserLibrary;
  loadingLibrary: boolean;
  fetchLibraryError: string | null;
  refreshLibrary: () => void;
}

function useFetchLibrary(): IUseLibraryResponse {
  const [library, setLibrary] = useState<IUserLibrary>({
    books: [],
    count: 0,
    totalPages: 0,
  });
  const [loadingLibrary, setLoading] = useState<boolean>(true);
  const [fetchLibraryError, setError] = useState<string | null>(null);

  const fetchLibrary = useCallback(() => {
    setLoading(true);
    setError(null);

    // eslint-disable-next-line promise/catch-or-return
    window.electron.ipcRenderer
      .invoke('get-library')
      // eslint-disable-next-line promise/always-return
      .then((list: IUserLibrary) => {
        setLibrary(list);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  return {
    library,
    loadingLibrary,
    fetchLibraryError,
    refreshLibrary: fetchLibrary,
  };
}

export default useFetchLibrary;
