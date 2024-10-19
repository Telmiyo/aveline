import { useState, useEffect } from 'react';
import { IBook } from '../../../../../shared/interfaces';

export default function Book({
  cover,
  fallbackCoverColor,
  title,
  onClick,
}: IBook & { onClick: () => void }) {
  // Type definition including onClick
  const [isCoverValid, setIsCoverValid] = useState<boolean>(true);

  const backgroundStyle = cover
    ? { backgroundImage: `url(${cover})` }
    : { backgroundColor: fallbackCoverColor };

  // Checks if the cover received is valid or not.
  useEffect(() => {
    if (cover) {
      const img = new Image();
      img.src = cover;

      img.onload = () => {
        setIsCoverValid(true);
      };

      img.onerror = () => {
        setIsCoverValid(false);
      };
    } else {
      setIsCoverValid(false);
    }
  }, [cover]);

  return (
    <button type="button" className="w-32 h-48" onClick={onClick}>
      <div
        className="relative transform w-full h-full rounded overflow-hidden shadow-2xl bg-cover bg-center flex items-center justify-center"
        style={backgroundStyle}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center ${!isCoverValid ? 'bg-black bg-opacity-50' : ''}`}
        >
          {!isCoverValid && (
            <p className="text-white font-bold text-center p-2">{title}</p>
          )}
        </div>
        <div className="absolute top-0 left-0 w-0.5 h-full bg-white bg-opacity-10 border-r-2 border-l-2 border-black" />
      </div>
      <div className="w-44 overflow-hidden text-ellipsis whitespace-nowrap mt-2" />
    </button>
  );
}
