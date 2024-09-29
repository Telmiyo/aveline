import React, { useEffect, useState } from 'react';
import { ReactReader } from 'react-reader';
import { ReaderManager, ITheme } from './ReaderManager';

interface ReaderProps {
  onTocChanged: (toc: any[]) => void;
}

export default function Reader({ onTocChanged }: ReaderProps) {
  const [location, setLocation] = useState<string | number>(0);
  const [theme, setTheme] = useState<ITheme>('light');
  const readerManager = new ReaderManager();

  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <ReactReader
      url="https://react-reader.metabits.no/files/alice.epub"
      location={location}
      locationChanged={(epubcfi: string) => setLocation(epubcfi)}
      readerStyles={readerManager.getTheme(theme)}
      getRendition={(rendition) => {
        readerManager.updateTheme(rendition, theme);
      }}
      showToc={false}
      tocChanged={(toc) => onTocChanged(toc)}
    />
  );
}
