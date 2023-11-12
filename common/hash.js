const crypto = require('crypto');
const fs = require('fs');

function generateHashSync(filePath, algorithm) {
  const fileContent = fs.readFileSync(filePath);
  const hash = crypto.createHash(algorithm).update(fileContent, 'utf-8').digest('hex');
  return hash;
}

module.exports = {
  generateHashSync
}