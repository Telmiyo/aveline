import { lazy, Suspense, useEffect, useState } from 'react';
import useFetchLibrary from '../../../hooks/useFetchLibrary';
import useUploadBook from '../../../hooks/useUploadBook';
import useToast from '../../../hooks/useToast';
import logo from '../../../../../assets/icon.png';
import '../../../styles/type-animation.css';
import Toast from '../../../shared/components/Toast';

const Book = lazy(() => import('../components/book/Book'));
const quote = `"The silence often of pure innocence persuades when speaking fails."
— William Shakespeare, The Winter's Tale`;

function Home() {
  const { library, loadingLibrary, fetchLibraryError, refreshLibrary } =
    useFetchLibrary();
  const { uploadBook, uploadError, uploadSuccess, resetUploadSuccess } =
    useUploadBook();
  const { isVisible, message, showToast } = useToast();
  const [animationTrigger, setAnimationTrigger] = useState(false);

  // Show toast if there is an error loading the library
  useEffect(() => {
    if (fetchLibraryError) {
      showToast({ message: `Error loading library` });
    }
  }, [fetchLibraryError, showToast]);

  // Show toast and refresh the library if the upload is successful
  useEffect(() => {
    if (uploadError) {
      showToast({
        message: `Error uploading the book, try another file`,
      });
    } else if (uploadSuccess) {
      showToast({ message: `The book has been added to your library` });
      refreshLibrary();
      resetUploadSuccess(); // Reset uploadSuccess to avoid infinite fetching
      setAnimationTrigger(true);
    }
  }, [
    uploadError,
    uploadSuccess,
    showToast,
    refreshLibrary,
    resetUploadSuccess,
  ]);

  // Reset animation trigger after the animation has played
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (animationTrigger) {
      const timeoutId = setTimeout(() => {
        setAnimationTrigger(false);
      }, 1000);

      return () => clearTimeout(timeoutId); // cleanup
    }
  }, [animationTrigger]);

  const renderLibraryContent = () => {
    if (loadingLibrary) {
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
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-auto gap-y-8 gap-x-4 transition-opacity duration-500 ${animationTrigger ? 'animate-fade' : ''}`}
          >
            {library.map((book) => (
              <Book
                cover={book.cover}
                title={book.title}
                filePath={book.filePath}
                key={`${book.title} + ${book.author}`}
              />
            ))}
          </div>
        </Suspense>
      );
    }
    // if the library is empty
    return <p>Add a new book to your library</p>;
  };

  const handleDialogue = async () => {
    const filePaths =
      await window.electron.ipcRenderer.invoke('open-file-dialog');
    return (filePaths as Array<string>) || [];
  };

  const handleUploadClick = async () => {
    const filePaths = await handleDialogue();
    if (filePaths.length > 0) {
      uploadBook(filePaths);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col justify-center items-center mb-8 ">
        <div className="w-fit flex flex-col items-center ">
          <img src={logo} alt="logo" className="w-28" />
          {/* Typewriting effect on the heading */}
          <div className="typewriter w-fit">
            <h2 className="w-fit">What are you going to read today?</h2>
          </div>
          {/* Quote Block */}
          <div className="">
            <blockquote className="text-sm mt-4 text-center">
              {quote}
            </blockquote>
          </div>
          <div>
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={loadingLibrary}
            >
              Upload Book
            </button>
          </div>
        </div>
      </div>
      {/* User Library */}
      <div className="flex items-center justify-center w-full">
        {renderLibraryContent()}
      </div>

      {/* Toast Notification */}
      <Toast message={message} isVisible={isVisible} />
    </div>
  );
}

export default Home;
