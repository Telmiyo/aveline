import { useState } from 'react';
import Reader from '../../../features/reading/reader/Reader';
import Toolbox from '../../../features/reading/toolbox/Toolbox';

interface ReaderLayoutProps {
  // eslint-disable-next-line react/require-default-props
  fileURL: string;
}

function ReaderLayout({ fileURL }: ReaderLayoutProps) {
  const [toc, setToc] = useState<any[]>([]);
  const [isToolboxHovered, setIsToolboxHovered] = useState(false);

  const [navigateTo, setNavigateTo] = useState<(href: string) => void>(
    () => {},
  );

  const handleTocChanged = (newToc: any[]) => {
    setToc(newToc);
  };

  const handleNavigateTo = (navigateFn: (href: string) => void) => {
    setNavigateTo(() => navigateFn);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Reader
        fileURL={fileURL}
        onTocChanged={handleTocChanged}
        onNavigateTo={handleNavigateTo}
      />
      <div
        className="absolute bottom-0 w-full h-20 group z-10"
        onMouseEnter={() => setIsToolboxHovered(true)}
        onMouseLeave={() => setIsToolboxHovered(false)}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Toolbox
            isVisible={isToolboxHovered}
            toc={toc}
            navigateTo={navigateTo}
          />
        </div>
      </div>
    </div>
  );
}

export default ReaderLayout;
