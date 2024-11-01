export interface IBook {
  uniqueKey: string;
  title: string;
  author: string;
  genre: string;
  cover: string;
  fallbackCoverColor: string;
  filePath: string;
}

export interface IUserLibrary {
  books: IBook[];
  count: number;
  totalPages: number;
}
