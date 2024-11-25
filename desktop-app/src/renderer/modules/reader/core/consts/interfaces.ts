export interface ITocElement {
  id: string;
  href: string;
  label: string;
  subitems: ITocElement[];
  parent: string | undefined;
}

export interface IToolboxProps {
  toc: {
    currentChapter: string;
    list: ITocElement[];
  };
  isVisible: boolean;
  navigateTo: (cfi: string) => void;
  toggleColumns: () => void;
}
