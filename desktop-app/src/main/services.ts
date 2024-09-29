import { ipcMain, dialog } from 'electron';
import { getUserDataPath, getUserBookList } from './util';
import path from 'path';
import fs from 'fs';

ipcMain.handle('get-library', async () => {
  const libraryPath = getUserDataPath('library');
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
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'EPUB Files', extensions: ['epub'] }]
  });
  return result.filePaths;
});
ipcMain.on('add-book', async (event, filePath) => {
  const libraryPath = getUserDataPath('library');
  const fileName = path.basename(filePath);
  console.log(fileName)
  const destinationPath = path.join(libraryPath, fileName);

  try {
    fs.copyFileSync(filePath, destinationPath);
    event.reply('save-book', `File created at ${destinationPath}`);
  } catch (error) {
    console.error('Error copying file:', error);
    event.reply('save-book', `Could not create the book`);
    throw new Error('Error creating file');
  }
});

