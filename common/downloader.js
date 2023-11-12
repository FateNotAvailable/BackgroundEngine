const { videosFolder } = require("../common/paths");
const path = require("path");
const https = require('https');
const fs = require('fs');

class Downloader {
    constructor() {}
    
    downloadFileInChunks = (url, destination) => {
        const chunks = [];
        const file = fs.createWriteStream(destination);
      
        const downloadChunk = (start, end) => {
          const options = {
            headers: { Range: `bytes=${start}-${end}` },
          };
      
          https.get(url, options, (response) => {
            response.on('data', (chunk) => {
              chunks.push(chunk);
            });
      
            response.on('end', () => {
              const chunkBuffer = Buffer.concat(chunks);
              file.write(chunkBuffer);
      
              if (response.headers['content-range']) {
                const totalSize = parseInt(response.headers['content-range'].split('/')[1]);
                const nextStart = end + 1;
                const nextEnd = Math.min(nextStart + 1024 * 1024 - 1, totalSize - 1);
      
                if (nextStart < totalSize) {
                  downloadChunk(nextStart, nextEnd);
                } else {
                  file.end(() => {
                    console.log('Download complete.');
                  });
                }
              }
            });
          });
        };
      
        downloadChunk(0, 1024 * 1024 - 1); // Start downloading the first chunk
      };

    download(url) {
        if (url.toString().endsWith(".mp4")) {
            return this.downloadMP4(url);
        }
    }

    downloadMP4(url) {
        this.downloadFileInChunks(url, path.join(videosFolder(), `${Math.floor(Date.now() / 1000)}.mp4`))
    }
}


module.exports = Downloader;