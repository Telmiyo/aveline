/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

function extractEpubCover(epubFilePath: string): string {
  // Copy the epub to a temporary file to manage it
  const epubBuffer = fs.readFileSync(epubFilePath);
  const { v4: uuidv4 } = require('uuid');
  const tempDir = path.join(app.getPath('userData'), `temp_${uuidv4()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const tempEpubPath = path.join(tempDir, 'temp.epub');
  fs.writeFileSync(tempEpubPath, epubBuffer);

  // eslint-disable-next-line global-require
  const extract = require('extract-zip');
  return extract(tempEpubPath, { dir: tempDir })
    .then(() => {
      // Find the cover image
      const oebpsFolder = path.join(tempDir, 'OEBPS/Images');
      const coverImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const coverImagePath = coverImageExtensions
        .map((ext) =>
          fs
            .readdirSync(oebpsFolder)
            .find((file) => file.toLowerCase().endsWith(`cover.${ext}`)),
        )
        .find((image) => image);

      // Change into base 64 format
      let base64Image = null;
      if (coverImagePath) {
        const fullPath = path.join(oebpsFolder, coverImagePath);
        const imageBuffer = fs.readFileSync(fullPath);
        const imageExtension = coverImagePath.split('.').pop();

        base64Image = imageBuffer.toString('base64');
        base64Image = `data:image/${imageExtension};base64,${base64Image}`;
      }

      // Clean up temporary files
      fs.unlinkSync(tempEpubPath);
      fs.rmSync(tempDir, { recursive: true });

      return base64Image;
    })
    .catch((err: Error) => {
      console.error('Error extracting EPUB:', err);
      return null;
    });
}

interface UserBookListInterface {
  cover: string;
  filePath: string;
}

export async function getUserBookList(
  filePaths: string[],
): Promise<UserBookListInterface[]> {
  try {
    const userBookList = await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          const cover = await extractEpubCover(filePath);
          return { cover, filePath };
        } catch (error) {
          console.error(`Error extracting cover for ${filePath}:`, error);
          return { cover: '', filePath };
        }
      }),
    );

    return userBookList.filter((book) => book.cover);
  } catch (error) {
    console.error('Error fetching user book list:', error);
    throw error;
  }
}

interface userDataPaths {
  baseDir: '';
  library: 'library';
}
export function getUserDataPath(dataPath: keyof userDataPaths): string {
  const appDataPath = app.getPath('userData');
  return path.join(appDataPath, dataPath);
}
