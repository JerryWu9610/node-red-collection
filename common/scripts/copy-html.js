const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
// check if the package.json in the current working directory
const packageJsonPath = path.join(cwd, 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('package.json not found in the current working directory')
  process.exit(1)
}

const fromDir = path.resolve(cwd, 'src')
const toDir = path.resolve(cwd, 'lib')
const excludeDirs = ['coverage']
copyHtmlFiles(fromDir, toDir)

// recursively copy html files from src to lib
function copyHtmlFiles(fromDir, toDir) {
  const entries = fs.readdirSync(fromDir, { withFileTypes: true })
  for (const entry of entries) {
    const from = path.resolve(fromDir, entry.name)
    const to = path.resolve(toDir, entry.name)
    if (entry.isDirectory()) {
      if (excludeDirs.includes(entry.name)) {
        continue
      }
      copyHtmlFiles(from, to)
    } else if (entry.isFile() && path.extname(entry.name) === '.html') {
        fs.mkdirSync(path.dirname(to), { recursive: true })
        fs.copyFileSync(from, to)
    }
  }
}
