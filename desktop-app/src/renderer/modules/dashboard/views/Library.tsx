import React, { useEffect, useState, Suspense, lazy } from 'react';
import HeaderLayout from '../layouts/HeaderLayout';
import { CiSquarePlus } from "react-icons/ci";

interface LibraryProps {
  cover: string;
  path: string;
}

// Lazy load the Book component
const Book = lazy(() => import('../components/book/Book'));

function Library() {
  const [library, setLibrary] = useState<LibraryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-library')
      .then((array: LibraryProps[]) => {
        console.log('User Library:', array);
        setLibrary(array);
      })
      .catch((error) => {
        console.error('Error fetching library:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const AddBookToLibrary = async () => {
    try {
      // Open a dialog to select EPUB files
      const filePaths = await window.electron.ipcRenderer.invoke('open-file-dialog');

      if (filePaths && filePaths.length > 0) {
        // Send the file paths to the main process to copy them
        for (const filePath of filePaths) {
          window.electron.ipcRenderer.sendMessage('add-book', filePath);
        }

        // Optionally, update the library after adding new books
        const updatedLibrary = await window.electron.ipcRenderer.invoke('get-library');
        setLibrary(updatedLibrary);
      }
    } catch (error) {
      console.error('Error adding book to library:', error);
    }
  };

  return (
    <HeaderLayout title="All Library">
      <CiSquarePlus size={28} className="absolute cursor-pointer right-8 top-8" onClick={AddBookToLibrary} />
      <div className="grid grid-cols-4 gap-y-8 items-center">
        {loading ? (
          <div
          className="absolute top-1/2 left-1/2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
            >
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >
              Loading...
            </span>
          </div>
        ) : library.length > 0 ? (
          <Suspense fallback={<div>Loading books...</div>}>
            {library.map((book: LibraryProps, index) => (
              <Book key={index} cover={book?.cover} />
            ))}
          </Suspense>
        ) : (
          <p>No books in your library.</p>
        )}
      </div>
    </HeaderLayout>
  );
}

export default Library;
