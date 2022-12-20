const fs = require('fs');
const path = require('path');

const TASKS_CONFIG = [
  {
    taskId: 'hierarchy',
    title: 'Ziua 1: Bateriile',
    explainerFileName: 'curs1-intro-ierarhie.md',
    fileNamesThatCanBeEdited: ['day1-hierarchy-attributes.tsx'],
    startingFileName: 'day1-hierarchy-attributes.tsx'
  },
  {
    taskId: 'shapes',
    title: 'Ziua 2. Generatorul de cadouri.',
    explainerFileName: 'curs2-geometry.md',
    fileNamesThatCanBeEdited: ['day2-custom-shapes.tsx'],
    startingFileName: 'day2-custom-shapes.tsx'
  },
  {
    taskId: 'movement',
    title: 'Ziua 3. Să meargă banda!',
    explainerFileName: 'curs3-lifecycle.md',
    fileNamesThatCanBeEdited: ['day3-useFrame.tsx'],
    startingFileName: 'day3-useFrame.tsx'
  },
  {
    taskId: 'mesh',
    title: 'Ziua 4. Culoarea cadourilor',
    explainerFileName: 'curs4-texturing.md',
    fileNamesThatCanBeEdited: ['day4-texturing.tsx'],
    startingFileName: 'day4-texturing.tsx'
  },
  {
    taskId: 'physics',
    title: 'Ziua 5. Împinge cadourile în sac!',
    explainerFileName: 'curs5-physics.md',
    fileNamesThatCanBeEdited: ['day5-physics.tsx'],
    startingFileName: 'day5-physics.tsx'
  },
  {
    taskId: 'interactions',
    title: 'Ziua 6. The final step!',
    explainerFileName: 'curs6-spring.md',
    fileNamesThatCanBeEdited: ['day6-spring.tsx'],
    startingFileName: 'day6-spring.tsx'
  },
];

async function run() {
  const tasks = [];
  
  const startingCodeString = await fs.promises.readFile(`${__dirname}/result.json`, "utf-8");
  const startingCode = JSON.parse(startingCodeString);

  for (let taskConfig of TASKS_CONFIG) {
    const explainerFilePath = path.resolve(__dirname, `../courses/${taskConfig.explainerFileName}`);
    const explainer = await fs.promises.readFile(explainerFilePath, "utf-8");

    tasks.push({
      "taskId": taskConfig.taskId,
      title: taskConfig.title,
      explainer,
      startingCode: startingCodeString,
      filesThatCanBeEdited: taskConfig.fileNamesThatCanBeEdited.map((fileName) => getFileId(startingCode, fileName)),
      startingFile: getFileId(startingCode, taskConfig.startingFileName)
    })
  }

  const outputPath = path.resolve(__dirname, 'tasks.json');
  await fs.promises.writeFile(outputPath, JSON.stringify(tasks));
}

function getFileId(folderStructure, fileName) {
  const fileMatch = folderStructure.files.find(f => f.name === fileName);
  if (fileMatch !== undefined) {
    return fileMatch.key;
  }

  for (let folder of folderStructure.folders) {
    const fileId = getFileId(folder, fileName);
    if (fileId !== undefined) {
      return fileId;
    }
  }

  return undefined;
}

module.exports = { run };
