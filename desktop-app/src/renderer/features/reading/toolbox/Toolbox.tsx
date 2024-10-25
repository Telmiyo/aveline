import { useEffect, useState } from 'react';
import { RiDropdownList } from 'react-icons/ri';

interface ITocElement {
  id: string;
  href: string;
  label: string;
  subitems: ITocElement[];
  parent: string | undefined;
}

interface IToolboxProps {
  toc: ITocElement[];
  navigateTo: (cfi: string) => void;
}

export default function Toolbox({ toc, navigateTo }: IToolboxProps) {
  const [chapters, setChapters] = useState<ITocElement[]>([]);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const handleClick = (href: string) => navigateTo(href);
  const onToggleToc = () => setIsTocOpen(!isTocOpen);

  useEffect(() => {
    setChapters(toc);
  }, [toc]);

  const renderTocItems = (items: ITocElement[]) => {
    return (
      <div className="overflow-y-scroll overflow-x-hidden">
        {items.map((item) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
          <div
            key={item.id}
            className={`${item.parent ? 'ml-2 font-light' : 'ml-2 font-bold'}`}
            role="button"
            onClick={(event) => {
              event.stopPropagation();
              handleClick(item.href);
            }}
          >
            <div className="cursor-pointer">{item.label.trim()}</div>
            {item.subitems.length > 0 && (
              <div className="ml-1">{renderTocItems(item.subitems)}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <RiDropdownList size={25} className="relative" onClick={onToggleToc} />
      {isTocOpen && (
        <div className="absolute bottom-[44px] w-80 h-[400px] bg-white border-2 border-gray-300 rounded-md shadow-md overflow-y-scroll">
          {renderTocItems(chapters)}
        </div>
      )}
    </div>
  );
}
