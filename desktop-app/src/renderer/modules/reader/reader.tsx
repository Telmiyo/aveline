import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReaderLayout from './layouts/ReaderLayout';

function Reader() {
  const { url } = useParams<{ url: string }>();

  useEffect(() => {
    // Cleanup function to stop the server when the component unmounts
    return () => {
      window.electron.ipcRenderer.invoke('close-book').catch((error) => {
        // TODO: Monitor this scenario and handle it appropriately
        console.error('Error closing book on unmount:', error);
      });
    };
  }, []);

  if (!url) {
    return (
      <div>Error: There was an issue loading the file, please try again :/</div>
    );
  }

  return <ReaderLayout fileURL={url} />;
}

export default Reader;
