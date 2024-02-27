const fs = require('fs');
const path = require('path');

// 1. receive node-name and project-name from command line
const nodeName = process.argv[2];
const projectName = process.argv[3];

// 2. copy packages/boilerplate to packages/{{project-name}}
const fromDir = path.resolve(__dirname, '../../packages/boilerplate');
const toDir = path.resolve(__dirname, `../../packages/${projectName}`);
const filepaths = copyFiles(fromDir, toDir);

// 3. replace all {{project-name}} and {{node-name}} in the copied files
for (const filepath of filepaths) {
  const fileContent = fs.readFileSync(filepath, 'utf8');
  const handledContent = fileContent
    .replace(/\{\{project-name\}\}/g, projectName)
    .replace(/\{\{node-name\}\}/g, nodeName);
  if (fileContent !== handledContent) {
    fs.writeFileSync(filepath, handledContent);
  }
}

function copyFiles(fromDir, toDir) {
  const entries = fs.readdirSync(fromDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const from = path.resolve(fromDir, entry.name);
    const to = path.resolve(toDir, entry.name)
      .replace(/\{\{project-name\}\}/g, projectName)
      .replace(/\{\{node-name\}\}/g, nodeName);
    if (entry.isDirectory()) {
      files.push(...copyFiles(from, to));
    } else if (entry.isFile()) {
      const dirname = path.dirname(to);
      fs.mkdirSync(dirname, { recursive: true });
      fs.copyFileSync(from, path.resolve(dirname, to));
      files.push(to);
    }
  }
  return files;
}
