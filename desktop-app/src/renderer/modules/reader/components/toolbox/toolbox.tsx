import { useEffect, useState, useCallback } from 'react';
import { PiListBulletsThin } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import AVELINE_ICON from '@assets/icon.svg';
import { ITocItem } from './consts/toc-item';
import { useReaderManager } from '../reader/context/reader-context';
import ColumnSwitch from './components/column-switcher';

interface ToolboxProps {
  isVisible: boolean;
  navigateTo: (href: string) => void;
}

export default function Toolbox({ isVisible, navigateTo }: ToolboxProps) {
  // table of contents
  const [chapters, setChapters] = useState<ITocItem[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  // settings
  const [isTocOpen, setIsTocOpen] = useState(false);

  // utils
  const readerManager = useReaderManager();
  const navigate = useNavigate();
  const updateCurrentChapter = useCallback(async () => {
    const chapterId = await readerManager.getCurrentChapterID();
    setCurrentChapterId(chapterId || null);
  }, [readerManager]);
  const onToggleToc = () => setIsTocOpen(!isTocOpen);
  const handleClick = (href: string) => {
    navigateTo(href);
    setTimeout(() => {
      updateCurrentChapter();
    }, 100);
  };

  useEffect(() => {
    const fetchTOC = async () => {
      const toc = await readerManager.getTOC();
      setChapters(toc);
    };
    fetchTOC();
  }, [readerManager]);

  useEffect(() => {
    // Initial chapter update
    updateCurrentChapter();
  }, [readerManager, isTocOpen, updateCurrentChapter]);

  useEffect(() => {
    if (!isVisible) {
      setIsTocOpen(false);
    }
  }, [isVisible]);

  const renderTocItems = (items: ITocItem[]) => {
    return (
      <div className="overflow-y-scroll overflow-x-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${
              item.parent === undefined
                ? 'font-bold'
                : 'font-light text-gray-600'
            } text-sm`}
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              handleClick(item.href);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                handleClick(item.href);
              }
            }}
          >
            <div
              className={`cursor-pointer ${
                item.id === currentChapterId
                  ? 'bg-gray-200'
                  : 'hover:bg-gray-200'
              }`}
            >
              <p
                className={`${item.parent !== undefined ? 'ml-8' : ''} ml-2 p-2 mb-2`}
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
    <div className="h-full flex items-center justify-center gap-4 cursor-pointer">
      {/* Toggle Columns */}
      <ColumnSwitch />
      {/* Home Button */}
      <button
        type="button"
        onClick={() => navigate('/dashboard/home')}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/home')}
        className="w-20 p-0 border-none bg-transparent cursor-pointer"
      >
        <img src={AVELINE_ICON} alt="aveline-logo" className="w-20" />
      </button>
      {/* TOC Toggle */}
      <PiListBulletsThin size={25} className="relative" onClick={onToggleToc} />
      {isTocOpen && (
        <div className="absolute bottom-[44px] w-80 h-[400px] bg-white border-2 border-gray-300 rounded-md shadow-md overflow-y-scroll">
          {renderTocItems(chapters)}
        </div>
      )}
    </div>
  );
}
