import { useEffect, useState } from 'react';
import { PiArticleThin, PiTextColumnsThin } from 'react-icons/pi';
import { useReaderManager } from '@reader/components/reader/context/reader-context';

export default function ColumnSwitch() {
  const [isSinglePage, setIsSinglePage] = useState(false);
  const readerManager = useReaderManager();

  useEffect(() => {
    const mode = readerManager.getColumnsMode();
    setIsSinglePage(!mode);
  }, [readerManager]);

  const toggleColumns = () => {
    readerManager.toggleColumns();
    setIsSinglePage(!isSinglePage);
  };

  if (isSinglePage) {
    return <PiArticleThin size={25} onClick={toggleColumns} />;
  }
  return <PiTextColumnsThin size={25} onClick={toggleColumns} />;
}
