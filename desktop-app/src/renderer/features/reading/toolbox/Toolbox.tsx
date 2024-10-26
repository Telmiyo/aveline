import { useEffect, useState } from 'react';
import { RiDropdownList } from 'react-icons/ri';
import { CiHome } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

interface ITocElement {
  id: string;
  href: string;
  label: string;
  subitems: ITocElement[];
  parent: string | undefined;
}

interface IToolboxProps {
  toc: ITocElement[];
  isVisible: boolean;
  navigateTo: (cfi: string) => void;
}

export default function Toolbox({ toc, isVisible, navigateTo }: IToolboxProps) {
  const [chapters, setChapters] = useState<ITocElement[]>([]);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const handleClick = (href: string) => navigateTo(href);
  const onToggleToc = () => setIsTocOpen(!isTocOpen);
  const navigate = useNavigate();

  useEffect(() => {
    setChapters(toc);
  }, [toc]);

  useEffect(() => {
    if (!isVisible) {
      setIsTocOpen(false);
    }
  }, [isVisible]);

  const renderTocItems = (items: ITocElement[]) => {
    return (
      <div className="overflow-y-scroll overflow-x-hidden">
        {items.map((item) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
          <div
            key={item.id}
            className={`${item.parent === undefined ? 'font-bold' : 'font-light text-gray-600'} text-sm `}
            role="button"
            onClick={(event) => {
              event.stopPropagation();
              handleClick(item.href);
            }}
          >
            <div className="cursor-pointer hover:bg-gray-200 ">
              <p
                className={`${item.parent !== undefined ? 'ml-8' : ''} ml-2 p-2 mb-2 `}
              >
                {item.label.trim()}
              </p>
              <hr />
            </div>
            {item.subitems.length > 0 && (
              <div>{renderTocItems(item.subitems)}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex items-center justify-center gap-4">
      {/* HOME */}
      <CiHome size={25} onClick={() => navigate('/dashboard/home')} />
      {/* TOC */}
      <RiDropdownList size={25} className="relative" onClick={onToggleToc} />
      {isTocOpen && (
        <div className="absolute bottom-[44px] w-80 h-[400px] bg-white border-2 border-gray-300 rounded-md shadow-md overflow-y-scroll">
          {renderTocItems(chapters)}
        </div>
      )}
    </div>
  );
}
