import { useEffect, useState, useCallback } from 'react';

interface IBookProps {
  title: string;
  author: string;
  cover: string;
  filePath: string;
}

interface IUseLibraryResponse {
  library: IBookProps[];
  loadingLibrary: boolean;
  fetchLibraryError: string | null;
  refreshLibrary: () => void;
}

function useFetchLibrary(): IUseLibraryResponse {
  const [library, setLibrary] = useState<IBookProps[]>([]);
  const [loadingLibrary, setLoading] = useState<boolean>(true);
  const [fetchLibraryError, setError] = useState<string | null>(null);

  const fetchLibrary = useCallback(() => {
    setLoading(true);
    setError(null);

    // eslint-disable-next-line promise/catch-or-return
    window.electron.ipcRenderer
      .invoke('get-library')
      // eslint-disable-next-line promise/always-return
      .then((list: IBookProps[]) => {
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
