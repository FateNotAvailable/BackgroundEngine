const fs = require('fs');
const path = require('path');

function videosFolder() {
    const videos_path = path.join(backgroundEngineFolder(), 'videos');
    try {
      if (!fs.existsSync(videos_path)) {
        fs.mkdirSync(videos_path);
      }
  
      return videos_path;
    } catch (err) {
      console.error(`Error creating folder: ${err.message}`);
      return null;
    }
  }
  
  function backgroundEngineFolder() {
    const appDataPath = process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Roaming');
    const folderName = 'BackgroundEngineData';
    const folderPath = path.join(appDataPath, folderName);
  
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      } else {
        //console.log(`Folder "${folderName}" already exists at: ${folderPath}`);
      }
  
      return folderPath;
    } catch (err) {
      console.error(`Error creating folder: ${err.message}`);
      return null;
    }
  }

  module.exports = {
    backgroundEngineFolder, videosFolder
  }