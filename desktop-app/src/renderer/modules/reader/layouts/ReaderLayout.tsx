import { useState } from 'react';
import { CiHome } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import Reader from '../components/reader/Reader';
import Toolbox from '../components/toolbox/Toolbox';

interface ReaderLayoutProps {
  // eslint-disable-next-line react/require-default-props
  fileURL: string;
}

function ReaderLayout({ fileURL }: ReaderLayoutProps) {
  const navigate = useNavigate();

  const [toc, setToc] = useState<any[]>([]);
  const [navigateTo, setNavigateTo] = useState<(href: string) => void>(() => {
    console.warn('NavigateTo function not yet available');
  });

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
      <div className="absolute bottom-0 w-full h-20 group z-10">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Toolbox toc={toc} navigateTo={navigateTo} />
          <CiHome
            className="absolute top-0 left-0"
            onClick={() => navigate('/dashboard/home')}
          />
        </div>
      </div>
    </div>
  );
}

export default ReaderLayout;
