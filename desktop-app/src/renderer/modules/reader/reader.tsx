import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReaderLayout from './layouts/ReaderLayout';

function Reader() {
  const { id } = useParams<{ id: string }>();
  const [fileURL, setFileURL] = useState<string>('');

  useEffect(() => {
    if (id) {
      // Start the server and load the EPUB file
      window.electron.ipcRenderer
        .invoke('start-server', id)
        // eslint-disable-next-line promise/always-return
        .then((url: string) => {
          setFileURL(url);
        })
        .catch((error) => {
          console.error('Error starting server:', error);
        });
    }

    // Clean up the server when the component unmounts
    return () => {
      window.electron.ipcRenderer.invoke('stop-server');
    };
  }, [id]);

  if (!id) {
    return (
      <div>Error: There was an issue loading the file, please try again :/</div>
    );
  }

  return <ReaderLayout fileURL={fileURL} />;
}

export default Reader;
