import { ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import EPub from 'epub2';
import express from 'express'; // Fix express import
import { Server } from 'http';
import cors from 'cors';
import { getAvelineDataPath, getUserBookList, extractEpubCover } from '../util';
import { IBook, IUserLibrary } from '../../shared/interfaces/interfaces';

let server: Server | null = null;

/**
 * Handles the event where the user adds a new EPUB book to the library.
 * The file is copied to the library folder, and its metadata is extracted
 * to create a `.json` metadata file.
 *
 * @param {Electron.IpcMainEvent} event - The IPC event triggered by the renderer.
 * @param {string} filePath - The file path of the EPUB to add to the library.
 */
ipcMain.handle('add-book', async (event, filePath) => {
  const libraryPath = getAvelineDataPath('library');
  const fileName = path.basename(filePath);
  const destinationPath = path.join(libraryPath, fileName);

  try {
    // Copy the EPUB file into the Aveline library
    fs.copyFileSync(filePath, destinationPath);

    // Extract metadata from the EPUB file
    const epub = await EPub.createAsync(destinationPath);

    const cover = await extractEpubCover(destinationPath);

    const colors = {
      default: '#D58936',
      jasper: '#d73a4a',
      glaucous: '#6a7f8c',
      bronze: '#D58936',
      brown: '#A44200',
      satinSheenGold: '#A59132',
    } as const;

    // Generate a random color for the book cover if one is not provided
    const colorValues = Object.values(colors);
    const randomIndex = Math.floor(Math.random() * colorValues.length);
    const randomColor = colorValues[randomIndex];
    const fallbackCoverColor = randomColor;

    // eslint-disable-next-line global-require
    const { v4: uuidv4 } = require('uuid');
    const uniqueKey = uuidv4();

    const metadataJson: IBook = {
      uniqueKey,
      title: epub.metadata.title || fileName,
      author: epub.metadata.author || 'Unknown Author',
      cover,
      fallbackCoverColor,
      filePath: destinationPath,
    };

    // Save the metadata as a JSON file alongside the book
    fs.writeFileSync(
      `${destinationPath}.json`,
      JSON.stringify(metadataJson, null, 2),
    );

    // Return the metadata on success
    return {
      success: true,
      message: `Book added at ${destinationPath}`,
      metadata: metadataJson,
    };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: `There was an issue processing this file: ${err.message}. Please try again with another file.`,
    };
  }
});

/**
 * Handles the 'get-library' event to retrieve the list of EPUB books from the user's library.
 *
 * @returns {Promise<IUserLibrary>} A promise that resolves to an array of file paths for the EPUB books in the library.
 * If the library directory is empty or does not exist, it returns an empty array.
 */
ipcMain.handle('get-library', async (): Promise<IUserLibrary> => {
  const libraryPath = getAvelineDataPath('library');

  try {
    const dirContent = await fs.promises.readdir(libraryPath);

    if (dirContent.length === 0) {
      return { books: [], count: 0, totalPages: 0 };
    }

    // If directory has content, process the book files
    const fullPaths = dirContent
      .map((file) => path.join(libraryPath, file))
      .filter((fullPath) => fullPath.includes('.json'));

    return await getUserBookList(fullPaths);
  } catch (error) {
    // If directory doesn't exist, create it and return an empty array
    await fs.promises.mkdir(libraryPath, { recursive: true });
    return { books: [], count: 0, totalPages: 0 };
  }
});

/**
 * Opens a file dialog for the user to select one or more EPUB files to add to the library.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths for the selected EPUB files.
 */
ipcMain.handle('open-file-dialog', async (): Promise<string[]> => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'EPUB Files', extensions: ['epub'] }],
  });
  return result.filePaths;
});

/**
 * IPC handler to start the server to serve the EPUB file.
 * The server is started with the file path provided.
 *
 * @param {Electron.IpcMainInvokeEvent} event - The IPC invoke event triggered by the renderer.
 * @param {string} filePath - The file path of the EPUB to serve.
 * @returns {Promise<{ success: boolean; url?: string; error?: string }>}
 * A promise that resolves to an object with the URL of the served EPUB file or an error message.
 */
ipcMain.handle('open-book', async (event, filePath) => {
  try {
    if (!filePath) {
      return { success: false, error: 'No file provided.' };
    }

    if (path.extname(filePath).toLowerCase() !== '.epub') {
      return {
        success: false,
        error: 'The provided file is not an EPUB file.',
      };
    }

    if (!server) {
      const expressApp = express();
      const staticFilePath = path.dirname(filePath);

      expressApp.use(cors());
      expressApp.use(express.static(staticFilePath));

      server = expressApp.listen(3000);
    }

    const fileName = path.basename(filePath);
    return { success: true, url: `http://localhost:3000/${fileName}` };
  } catch (error) {
    return { success: false, error: `Error opening book, please try again.` };
  }
});

// TODO: improve how this is handled in main
export default function stopCurrentServer(): void {
  // Attempt to close the server
  if (server && server.listening) {
    server.close((err) => {
      if (err) {
        // MONITORIZATION: send an error message
      }
    });

    server = null;
  }
}

/**
 * IPC handler to stop the running Express server, if any.
 * @returns {Promise<{ success: boolean; error?: string }>}
 * A promise that resolves to an object indicating whether the server was stopped successfully or if an error occurred.
 */
ipcMain.handle('close-book', async () => {
  try {
    if (!server) {
      return { success: false, error: 'No book is opened' };
    }
    stopCurrentServer();
    return { success: true };
  } catch (error) {
    // MONITORIZATION: send an error message
    return { success: false, error: `Unexpected error` };
  }
});
