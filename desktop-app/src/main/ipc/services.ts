import { ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import EPub from 'epub2';
import express from 'express'; // Fix express import
import { Server } from 'http';
import cors from 'cors';
import { getAvelineDataPath, getUserBookList, extractEpubCover } from '../util';
import { IBook, IUserLibrary } from '../../shared/interfaces';

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
 * Starts a local Express server to serve the selected EPUB file.
 * It serves static files from the directory where the EPUB is located.
 *
 * @param {string} filePath - The path of the EPUB file to be served.
 * @returns {Promise<string>} A promise that resolves to the URL of the served EPUB file.
 */
export const startServer = async (filePath: string): Promise<string> => {
  if (!server) {
    const expressApp = express();
    const staticFilePath = path.dirname(filePath);

    expressApp.use(cors());
    expressApp.use(express.static(staticFilePath));

    server = expressApp.listen(3000, () => {
      console.log('File server is running on http://localhost:3000');
    });
  }

  // Return the URL to access the EPUB
  const fileName = path.basename(filePath);
  return `http://localhost:3000/${fileName}`;
};

/**
 * Stops the running Express server, if it's running.
 */
export const stopCurrentServer = (): void => {
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('Error stopping the server:', err);
      } else {
        console.log('Server has been stopped');
      }
    });

    server = null;
  }
};

/**
 * IPC handler to start the server to serve the EPUB file.
 * The server is started with the file path provided.
 *
 * @param {Electron.IpcMainInvokeEvent} event - The IPC invoke event triggered by the renderer.
 * @param {string} filePath - The file path of the EPUB to serve.
 * @returns {Promise<string>} A promise that resolves to the URL of the served EPUB file.
 */
ipcMain.handle('start-server', async (event, filePath) => {
  return startServer(filePath);
});

/**
 * IPC handler to stop the running Express server, if any.
 */
ipcMain.handle('stop-server', async () => {
  stopCurrentServer();
});
