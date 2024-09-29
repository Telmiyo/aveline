import { useState } from 'react';
import Reader from '../components/reader/Reader';
import Toolbox from '../components/toolbox/Toolbox';

function ReaderLayout() {
  const [toc, setToc] = useState<any[]>([]);

  const handleTocChanged = (newToc: any[]) => {
    setToc(newToc);
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Reader onTocChanged={handleTocChanged} />
      <div className="absolute bottom-0 w-full h-20 group z-10">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Toolbox toc={toc} />
        </div>
      </div>
    </div>
  );
}

export default ReaderLayout;
