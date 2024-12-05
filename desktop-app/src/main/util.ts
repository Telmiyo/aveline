/* eslint import/prefer-default-export: off */
/* eslint-disable compat/compat */
import { URL } from 'url';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { IBook, IUserLibrary } from '../shared/interfaces/interfaces';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

function searchFile(directory: string, fileName: string): string | null {
  // read the contents of the directory
  const files = fs.readdirSync(directory);

  // search through the files
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // build the full path of the file
    const filePath = path.join(directory, file);

    // get the file stats
    const fileStat = fs.statSync(filePath);

    // if the file is a directory, recursively search the directory
    if (fileStat.isDirectory()) {
      const found: string | null = searchFile(filePath, fileName);
      if (found) return found;
    } else if (file === fileName) {
      // if the file is a match, print it
      return filePath;
    }
  }
  return null;
}

/**
 * Extracts the cover image from an EPUB file and returns it as a base64 encoded string.
 *
 * @param epubFilePath - The file path to the EPUB file from which the cover image is to be extracted.
 * @returns A base64 encoded string of the cover image if found, otherwise null.
 */
export function extractEpubCover(epubFilePath: string): string {
  // Copy the epub to a temporary file to manage it
  // eslint-disable-next-line global-require
  const { v4: uuidv4 } = require('uuid');
  const tempDir = path.join(app.getPath('temp'), `temp_${uuidv4()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const tempEpubPath = path.join(tempDir, 'temp.epub');
  const epubBuffer = fs.readFileSync(epubFilePath);
  fs.writeFileSync(tempEpubPath, epubBuffer);

  // eslint-disable-next-line global-require
  const extract = require('extract-zip');
  return extract(tempEpubPath, { dir: tempDir })
    .then(() => {
      // Find the cover image
      const coverImagePath =
        searchFile(tempDir, 'cover.jpg') ||
        searchFile(tempDir, 'cover.jpeg') ||
        searchFile(tempDir, 'cover.png') ||
        searchFile(tempDir, 'cover.html');

      // Change into base 64 format
      let base64Image = null;
      if (coverImagePath) {
        const imageBuffer = fs.readFileSync(coverImagePath);
        const imageExtension = coverImagePath.split('.').pop();

        base64Image = imageBuffer.toString('base64');
        base64Image = `data:image/${imageExtension};base64,${base64Image}`;
      }

      // Clean up temporary files
      fs.unlinkSync(tempEpubPath);
      fs.rmSync(tempDir, { recursive: true });

      return base64Image;
    })
    .catch(() => {
      // todo: add metrics for error monitoring
      return null;
    });
}

export async function getUserBookList(
  filePaths: string[],
): Promise<IUserLibrary> {
  // get book list
  const books: IBook[] = await Promise.all(
    filePaths.map(async (filePath) => {
      // Read the file asynchronously
      const jsonString = await fs.promises.readFile(filePath, 'utf-8');

      // Parse the JSON string into an object
      const book: IBook = JSON.parse(jsonString);

      return book;
    }),
  );
  // todo: paginate the response
  return { books, count: books.length, totalPages: 0 };
}

interface IUserDataPaths {
  baseDir: '';
  library: 'library';
}
export function getAvelineDataPath(dataPath: keyof IUserDataPaths): string {
  const appDataPath = app.getPath('userData');
  return path.join(appDataPath, dataPath);
}
