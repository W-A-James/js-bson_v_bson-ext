'use strict';

const fs = require('fs/promises');

(async () => {
  const resultPaths = [];

  for await (const dirent of await fs.opendir('./')) {
    if (/Results.json$/.test(dirent.name)) {
      resultPaths.push(`./${dirent.name}`);
    }
  }

  // Merge results into one file
  const collectedResults = await fs.open('resultsCollected.json', 'w+');
  await collectedResults.write('[\n');
  for (let i = 0; i < resultPaths.length; i++) {
    const resultPath = resultPaths[i];
    const results = require(resultPath);
    if (Array.isArray(results)) {
      for (let j = 0; j < results.length; j++) {
        collectedResults.write(
          `  ${JSON.stringify(results[j], undefined, 2)}${j === results.length - 1 && i === resultPaths.length - 1 ? '' : ',\n'
          }`
        );
      }
    }
  }

  await collectedResults.write(']\n');
  await collectedResults.close();

  console.log(`Collected results in ${__dirname}/resultsCollected.json`);
})();
