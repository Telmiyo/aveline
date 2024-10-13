import { useState, useEffect } from 'react';

interface BookProperties {
  cover: string;
  title: string;
}

const colors = {
  default: '#D58936',
  jasper: '#d73a4a',
  glaucous: '#6a7f8c',
  bronze: '#D58936',
  brown: '#A44200',
  satinSheenGold: '#A59132',
} as const;

export default function Book({ cover, title }: BookProperties) {
  const [isCoverValid, setIsCoverValid] = useState<boolean>(true);

  const getRandomColor = () => {
    const colorValues = Object.values(colors);
    const randomIndex = Math.floor(Math.random() * colorValues.length);
    return colorValues[randomIndex];
  };

  const backgroundStyle = cover
    ? { backgroundImage: `url(${cover})` }
    : { backgroundColor: getRandomColor() };

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
    <div className="w-44">
      <div
        className="cursor-pointer relative transform w-44 h-72 rounded overflow-hidden shadow-2xl bg-cover bg-center flex items-center justify-cente"
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
    </div>
  );
}
