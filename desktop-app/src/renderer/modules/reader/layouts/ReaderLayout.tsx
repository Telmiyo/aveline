import { useState } from 'react';
import Reader from '../core/reader/Reader';
import Toolbox from '../core/toolbox/Toolbox';

interface ReaderLayoutProps {
  fileURL: string;
}

function ReaderLayout({ fileURL }: ReaderLayoutProps) {
  const [isToolboxHovered, setIsToolboxHovered] = useState(false);

  const [navigateTo, setNavigateTo] = useState<(href: string) => void>(
    () => {},
  );

  const handleNavigateTo = (navigateFn: (href: string) => void) => {
    setNavigateTo(() => navigateFn);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Reader fileURL={fileURL} onNavigateTo={handleNavigateTo} />
      <div
        className="absolute bottom-0 w-full h-20 group z-10"
        onMouseEnter={() => setIsToolboxHovered(true)}
        onMouseLeave={() => setIsToolboxHovered(false)}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Toolbox isVisible={isToolboxHovered} navigateTo={navigateTo} />
        </div>
      </div>
    </div>
  );
}

export default ReaderLayout;
