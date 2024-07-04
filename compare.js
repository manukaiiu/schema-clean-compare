/**
 * HOW TO USE:
 * - Get the Repo, Have Git, Node and VSCode installed
 * - Copy both <file1>.sql and <file2>.sql to the input folder.
 * - Optional: Adjust lineStartersToFilter in compare.js
 * - Run "node compare.js <file1> <file2>".
 * - Enjoy the cleaned up git diff in VSCode.
 */

const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

// Get environment parameters from command line arguments
const file1 = process.argv[2];
const file2 = process.argv[3];

if (!file1 || !file2) {
  console.error('Please provide two file names as parameters.');
  process.exit(1);
}

/**
 * CONFIG
 */
const inputDir = 'input';
const outputDir = 'output';
const lineStartersToFilter = [
  '-- Name: ',
  'ALTER TYPE ',
  'ALTER TABLE ',
  'ALTER SEQUENCE ',
  'GRANT ',
];

const inputFilePath1 = `${inputDir}/${file1}.sql`;
const outputFilePath1 = `${outputDir}/${file1}.sql`;
const inputFilePath2 = `${inputDir}/${file2}.sql`;
const outputFilePath2 = `${outputDir}/${file2}.sql`;

// Ensure the output directory exists
if (!fs.existsSync(outputDir)){
  fs.mkdirSync(outputDir);
}

async function cleanFile(inputFilePath, outputFilePath) {
  const input = fs.createReadStream(inputFilePath);
  const output = fs.createWriteStream(outputFilePath);

  // Write the header comment
  output.write(`-- Cleaned version of ${inputFilePath}\n`);
  output.write(`-- Removed lines starting with: ${lineStartersToFilter.join(', ')}\n\n`);

  const readLineTool = readline.createInterface({
    input: input,
    output: output,
    terminal: false
  });

  readLineTool.on('line', (line) => {
    const shouldFilter = lineStartersToFilter.some(starter => line.startsWith(starter));
    if (!shouldFilter) {
      output.write(line + '\n');
    }
  });

  readLineTool.on('close', () => {
    console.log(`Cleaning completed for ${inputFilePath}. Cleaned file saved as ${outputFilePath}`);
  });
}

async function main() {
  await cleanFile(inputFilePath1, outputFilePath1);
  await cleanFile(inputFilePath2, outputFilePath2);

  setTimeout(() => {
    // Open the diff in VSCode
    console.log('Opening diff in VSCode...');
    execSync(`code --diff ${outputFilePath1} ${outputFilePath2}`);
  }, 2000);
}

main();