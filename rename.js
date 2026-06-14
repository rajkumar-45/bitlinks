const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!['node_modules', '.next', '.git'].includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.js') || f.endsWith('.md') || f.endsWith('.json') || f.endsWith('.css')) {
        callback(dirPath);
      }
    }
  });
}

walkDir(__dirname, (filePath) => {
  if (filePath.endsWith('package-lock.json')) return;
  if (filePath.endsWith('rename.js')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/BitLinks/g, 'BlinkURL')
    .replace(/Bitlinks/g, 'BlinkURL')
    .replace(/bitlinks/g, 'blinkurl');
    
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated: ' + filePath);
  }
});
