const colors = {
  default: '#D58936',
  jasper: '#d73a4a',
  glaucous: '#6a7f8c',
  bronze: '#D58936',
  brown: '#A44200',
  satinSheenGold: '#A59132',
} as const;

// Create a type for the keys of the colors object
type ColorKey = keyof typeof colors;

interface BookProperties {
  cover: string;
}

export default function Book({ cover }: BookProperties) {
  // Get the color value from the colors object
  return (
    <div
      className="cursor-pointer relative transform w-44 h-72 rounded overflow-hidden shadow-2xl bg-cover bg-center"
      style={{ backgroundImage: `url(${cover})` }}
    >
      <div className="absolute top-0 left-0 w-0.5 h-full bg-white bg-opacity-10 border-r-2 border-l-2 border-black" />
    </div>
  );
}
