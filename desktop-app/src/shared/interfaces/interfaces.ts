import React from 'react';

export interface IBook {
  uniqueKey: string;
  title: string;
  author: string;
  genre: string[] | undefined;
  cover: string;
  fallbackCoverColor: string;
  filePath: string;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void | Promise<void>;
}

export interface IUserLibrary {
  books: IBook[];
  count: number;
  totalPages: number;
}
