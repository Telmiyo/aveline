export interface ITocItem {
  id: string;
  href: string;
  label: string;
  subitems: ITocItem[];
  parent: string | undefined;
}
