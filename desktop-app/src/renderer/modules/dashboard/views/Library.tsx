import React, { useEffect, useState, Suspense, lazy, useMemo } from 'react';
import { CiSquarePlus } from 'react-icons/ci';
import HeaderLayout from '../layouts/HeaderLayout';

interface BookProps {
  title: string;
  author: string;
  cover: string;
  filePath: string;
}

// Lazy load the Book component
const Book = lazy(() => import('../components/book/Book'));

function Library() {
  const [library, setLibrary] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      // eslint-disable-next-line promise/catch-or-return
      window.electron.ipcRenderer
        .invoke('get-library')
        .then((list: BookProps[]) => {
          setLibrary(list);
          return list;
        })
        .finally(() => setLoading(false));
    }
  }, [loading]);

  const AddBookToLibrary = async () => {
    try {
      const filePaths =
        await window.electron.ipcRenderer.invoke('open-file-dialog');

      if (filePaths && filePaths.length > 0) {
        filePaths.forEach((filePath: string) => {
          window.electron.ipcRenderer.sendMessage('add-book', filePath);
        });

        window.electron.ipcRenderer.on('add-book-error', () => {
          // showToast(message as string);
        });
        window.electron.ipcRenderer.on('add-book-success', () => {
          setLoading(true);
        });
      }
    } catch (error) {
      console.error('Error adding book to library:', error);
    }
  };

  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <div
          className="absolute top-1/2 left-1/2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      );
    }

    if (library.length > 0) {
      return (
        <Suspense fallback={<div>Loading books...</div>}>
          {library.map((book: BookProps) => (
            <div key={`${book.title} + ${book.author}`}>
              <Book
                cover={book.cover}
                title={book.title}
                filePath={book.filePath}
              />
            </div>
          ))}
        </Suspense>
      );
    }

    return <p>No books in your library.</p>;
  }, [loading, library]);

  return (
    <HeaderLayout title="All Library">
      <CiSquarePlus
        size={28}
        className="absolute cursor-pointer right-8 top-8"
        onClick={AddBookToLibrary}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-y-8 items-center">
        {renderContent}
      </div>
    </HeaderLayout>
  );
}

export default Library;
