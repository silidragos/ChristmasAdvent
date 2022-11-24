const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const IGNORE_LIST = [
  '.DS_Store'
];

run();

async function run() {
  const FOLDER_PATH = 'src';
  const result = await createFolderStructure('', FOLDER_PATH);

  fs.promises.writeFile(`${__dirname}/result.txt`, JSON.stringify(result));
  console.log("Written result in result.txt");
}

async function createFolderStructure(folderName, folderPath) {
  const currentFolderStructure = {
    key: uuid(),
    name: folderName,
    files: [],
    folders: [],
  };

  try {
    const filesOrFolders = await fs.promises.readdir(folderPath);

    for (const fileOrFolder of filesOrFolders) {
      const fileOrFolderPath = path.join('.', folderPath, fileOrFolder);
      if (IGNORE_LIST.includes(fileOrFolder)) {
        continue;
      }

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fileOrFolderPath);


      if (stat.isFile()) {
        const fileContent = await fs.promises.readFile(fileOrFolderPath, "utf-8");
        currentFolderStructure.files.push({
          key: uuid(),
          name: fileOrFolder,
          content: fileContent
        });
      }

      if (stat.isDirectory()) {
        const innerFolderStructure = await createFolderStructure(fileOrFolder, fileOrFolderPath);
        currentFolderStructure.folders.push(innerFolderStructure);
      }
    }

    return currentFolderStructure;
  }
  catch (err) {
    console.error("Something went wrong!", err);
  }
}
