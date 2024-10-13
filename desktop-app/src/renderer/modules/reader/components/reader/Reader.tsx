import React, { useEffect, useState } from 'react';
import { ReactReader } from 'react-reader';
import { ReaderManager, ITheme } from './ReaderManager';

interface ReaderProps {
  fileURL: string;
  onTocChanged: (toc: any[]) => void;
  onNavigateTo: (navigateTo: (href: string) => void) => void;
}

export default function Reader({
  fileURL,
  onTocChanged,
  onNavigateTo,
}: ReaderProps) {
  const [location, setLocation] = useState<string | number>(0);
  const [theme, setTheme] = useState<ITheme>('light');
  const readerManager = new ReaderManager();

  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <ReactReader
      url={fileURL}
      location={location}
      locationChanged={(epubcfi: string) => setLocation(epubcfi)}
      readerStyles={readerManager.getTheme(theme)}
      getRendition={(rendition) => {
        readerManager.updateTheme(rendition, theme);

        // Pass the navigateTo function to the parent component
        onNavigateTo((href: string) => rendition.display(href));
      }}
      showToc={false}
      tocChanged={(toc) => onTocChanged(toc)} // Pass TOC data to the parent
    />
  );
}
