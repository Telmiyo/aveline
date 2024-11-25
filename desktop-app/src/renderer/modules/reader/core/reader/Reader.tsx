import { useEffect, useState } from 'react';
import { ReactReader } from '../../libraries/react-reader';
import { useReaderManager, ITheme } from '../context/ReaderContext';
import { ITocElement } from '../consts/interfaces';

interface ReaderProps {
  fileURL: string;
  onNavigateTo: (navigateTo: (href: string) => void) => void;
}

export default function Reader({ fileURL, onNavigateTo }: ReaderProps) {
  const [location, setLocation] = useState<string | number>(0);
  const [theme, setTheme] = useState<ITheme>('light');
  const readerManager = useReaderManager();

  useEffect(() => {
    setTheme('light');
  }, []);

  const handleLocation = (epubcfi: string) => {
    setLocation(epubcfi);
  };

  useEffect(() => {
    const initializeTOC = async () => {
      if (readerManager.getRendition()) {
        const toc = await readerManager.getTOC();
        readerManager.setTOC(toc as ITocElement[]);
      }
    };

    initializeTOC();
  }, [readerManager]);

  return (
    <ReactReader
      url={fileURL}
      location={location}
      locationChanged={(epubcfi: string) => handleLocation(epubcfi)}
      readerStyles={readerManager.getTheme(theme)}
      getRendition={(rendition) => {
        readerManager.setRendition(rendition);
        readerManager.updateTheme(theme);

        // Pass the navigateTo function to the parent component
        onNavigateTo((href: string) => rendition.display(href));
      }}
      tocChanged={(toc) => {
        readerManager.setTOC(toc as ITocElement[]);
      }}
    />
  );
}
