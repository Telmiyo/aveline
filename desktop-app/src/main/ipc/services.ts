import { ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { getAvelineDataPath, getUserBookList, extractEpubCover } from '../util';
/**
 * Handles the 'get-library' event to retrieve the list of EPUB books in the user's library.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths for the EPUB books in the library.
 * If the library directory is empty or does not exist, it returns an empty array.
 */
ipcMain.handle('get-library', async () => {
  const libraryPath = getAvelineDataPath('library');

  try {
    const dirContent = await fs.promises.readdir(libraryPath);

    if (dirContent.length === 0) {
      return [];
    }

    // If directory has content, process the book files
    const fullPaths = dirContent
      .map((file) => path.join(libraryPath, file))
      .filter((fullPath) => fullPath.includes('.epub'));

    return getUserBookList(fullPaths);
  } catch (error) {
    // If directory doesn't exist, create it and return an empty array
    await fs.promises.mkdir(libraryPath, { recursive: true });
    console.info('user library directory created');
    return [];
  }
});

/**
 * This event is triggered when the user opens the file dialog to select EPUB files
 */
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'EPUB Files', extensions: ['epub'] }],
  });
  return result.filePaths;
});

/**
 * This event is triggered when the user adds a new book to the library
 */
ipcMain.on('add-book', async (event, filePath) => {
  const libraryPath = getAvelineDataPath('library');
  const fileName = path.basename(filePath);
  const destinationPath = path.join(libraryPath, fileName);

  try {
    // copy epub file into the aveline database
    fs.copyFileSync(filePath, destinationPath);

    // create metadata file for the book
    const metadata = {
      title: '',
      author: '',
      publicationYear: '',
      coverImage: extractEpubCover(filePath),
    };
    const metadataJson = JSON.stringify(metadata, null, 2);
    fs.writeFileSync(
      path.join(libraryPath, `${fileName}.aveline.metadata`),
      metadataJson,
    );

    event.reply('add-book', `File copied to ${destinationPath}`);
    fs.writeFileSync(destinationPath, `${fileName}.aveline.metadata`);

    event.reply('add-book', `File created at ${destinationPath}`);
  } catch (error) {
    console.error('Error copying file:', error);
    event.reply(
      'add-book-error',
      `There is an issue proccesign this file. Please try again with another file.`,
    );
    throw new Error('Error creating file');
  }
});
