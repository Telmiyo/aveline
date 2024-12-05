import { ITocItem } from '../consts/toc-item';

type IToolboxProps = {
  toc: {
    currentChapter: string;
    list: ITocItem[];
  };
  isVisible: boolean;
  navigateTo: (cfi: string) => void;
  toggleColumns: () => void;
};

export { IToolboxProps, ITocItem as ITocElement };
